/* eslint-disable no-console */
require('reflect-metadata');

const { randomUUID } = require('node:crypto');
const events = require('node:events');
const { performance } = require('node:perf_hooks');
const request = require('supertest');
const { Controller, Get, Injectable, Module, Scope, RequestMethod } = require('@nestjs/common');
const { Test } = require('@nestjs/testing');
const { ClsModule, ClsService } = require('nestjs-cls');

const nestRequestContext = require('../../packages/nest/dist/index.cjs');
const requestContextCore = require('../../packages/core/dist/index.cjs');
const expressAdapter = require('../../packages/adapter-express/dist/index.cjs');

const { REQUEST_ID_KEY } = nestRequestContext;
const { get } = requestContextCore;
const { requestContextMiddleware } = expressAdapter;
const MB = 1024 * 1024;

events.defaultMaxListeners = 0;

function decorateControllerWithGet(klass, methodName, path) {
  Controller()(klass);
  const descriptor = Object.getOwnPropertyDescriptor(klass.prototype, methodName);
  Get(path)(klass.prototype, methodName, descriptor);
}

function withRequestScopedApp() {
  class RequestScopedContextService {
    constructor() {
      this.requestId = randomUUID();
    }

    getRequestId() {
      return this.requestId;
    }
  }

  class RequestScopedAuditService {
    constructor(context) {
      this.context = context;
      this.cache = { startedAt: Date.now() };
    }

    getRequestId() {
      return this.context.getRequestId();
    }
  }

  class RequestScopedBusinessService {
    constructor(audit) {
      this.audit = audit;
      this.meta = { source: 'bench' };
    }

    getRequestId() {
      return this.audit.getRequestId();
    }
  }

  Injectable({ scope: Scope.REQUEST })(RequestScopedContextService);
  Injectable({ scope: Scope.REQUEST })(RequestScopedAuditService);
  Injectable({ scope: Scope.REQUEST })(RequestScopedBusinessService);

  Reflect.defineMetadata(
    'design:paramtypes',
    [RequestScopedContextService],
    RequestScopedAuditService
  );
  Reflect.defineMetadata(
    'design:paramtypes',
    [RequestScopedAuditService],
    RequestScopedBusinessService
  );

  class RequestScopedController {
    constructor(business) {
      this.business = business;
    }

    ping() {
      return { requestId: this.business.getRequestId() };
    }
  }

  Reflect.defineMetadata(
    'design:paramtypes',
    [RequestScopedBusinessService],
    RequestScopedController
  );
  decorateControllerWithGet(RequestScopedController, 'ping', 'bench');

  class RequestScopedModule {}
  Module({
    controllers: [RequestScopedController],
    providers: [
      RequestScopedContextService,
      RequestScopedAuditService,
      RequestScopedBusinessService,
    ],
  })(RequestScopedModule);

  return RequestScopedModule;
}

function withRequestContextApp() {
  class RequestContextController {
    ping() {
      return { requestId: get(REQUEST_ID_KEY) };
    }
  }

  decorateControllerWithGet(RequestContextController, 'ping', 'bench');

  class RequestContextAppModule {
    configure(consumer) {
      consumer
        .apply(requestContextMiddleware())
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
  }

  Module({
    controllers: [RequestContextController],
  })(RequestContextAppModule);

  return RequestContextAppModule;
}

function withNestjsClsApp() {
  class NestjsClsController {
    constructor(cls) {
      this.cls = cls;
    }

    ping() {
      return { requestId: this.cls.get('requestId') };
    }
  }

  Reflect.defineMetadata('design:paramtypes', [ClsService], NestjsClsController);
  decorateControllerWithGet(NestjsClsController, 'ping', 'bench');

  class NestjsClsAppModule {}
  Module({
    imports: [
      ClsModule.forRoot({
        middleware: {
          mount: true,
          setup: (cls, req) => {
            const headerValue = req?.headers?.['x-request-id'];
            const requestId =
              typeof headerValue === 'string' && headerValue.length > 0
                ? headerValue
                : randomUUID();
            cls.set('requestId', requestId);
          },
        },
      }),
    ],
    controllers: [NestjsClsController],
  })(NestjsClsAppModule);

  return NestjsClsAppModule;
}

async function createApp(moduleClass) {
  const moduleRef = await Test.createTestingModule({
    imports: [moduleClass],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

async function runLoad(httpServer, totalRequests, concurrency) {
  let cursor = 0;

  const hitEndpoint = async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await request(httpServer).get('/bench').expect(200);
        return;
      } catch (error) {
        if (attempt === 2) {
          throw error;
        }
      }
    }
  };

  const worker = async () => {
    while (true) {
      const idx = cursor;
      cursor += 1;
      if (idx >= totalRequests) {
        return;
      }
      await hitEndpoint();
    }
  };

  const workers = Array.from({ length: concurrency }, () => worker());

  const start = performance.now();
  await Promise.all(workers);
  const end = performance.now();

  return end - start;
}

async function benchmarkScenario(label, moduleFactory, options) {
  const app = await createApp(moduleFactory());
  const httpServer = app.getHttpServer();
  httpServer.setMaxListeners(0);

  const measureMemory = async () => {
    if (typeof global.gc !== 'function') {
      return null;
    }

    const forceGc = async () => {
      global.gc();
      await new Promise((resolve) => setTimeout(resolve, 20));
      global.gc();
    };

    await forceGc();
    const before = process.memoryUsage();
    let peakHeap = before.heapUsed;

    const sampler = setInterval(() => {
      const current = process.memoryUsage().heapUsed;
      if (current > peakHeap) {
        peakHeap = current;
      }
    }, 20);

    await runLoad(httpServer, options.memoryRequests, options.concurrency);

    clearInterval(sampler);
    await forceGc();
    const after = process.memoryUsage();

    return {
      heapRetainedMb: (after.heapUsed - before.heapUsed) / MB,
      peakHeapDeltaMb: (peakHeap - before.heapUsed) / MB,
      rssDeltaMb: (after.rss - before.rss) / MB,
    };
  };

  try {
    await runLoad(httpServer, options.warmupRequests, options.concurrency);
    const ms = await runLoad(httpServer, options.totalRequests, options.concurrency);
    const memory = await measureMemory();

    return {
      label,
      ms,
      rps: (options.totalRequests * 1000) / ms,
      usPerRequest: (ms * 1000) / options.totalRequests,
      memory,
    };
  } finally {
    await app.close();
  }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

function percentDelta(value, baseline) {
  if (baseline === 0) {
    return Number.NaN;
  }
  return ((value - baseline) / baseline) * 100;
}

async function main() {
  const options = {
    warmupRequests: 300,
    totalRequests: 3000,
    concurrency: 30,
    memoryRequests: 6000,
    rounds: 5,
  };

  console.log('Benchmark config:', JSON.stringify(options));
  const baselineRuns = [];
  const requestContextRuns = [];
  const nestjsClsRuns = [];

  for (let round = 1; round <= options.rounds; round += 1) {
    const scenarios = [
      {
        id: 'request-scoped',
        run: () => benchmarkScenario('Request-scoped provider', withRequestScopedApp, options),
      },
      {
        id: 'request-context',
        run: () =>
          benchmarkScenario('@pas7/nestjs-request-context', withRequestContextApp, options),
      },
      {
        id: 'nestjs-cls',
        run: () => benchmarkScenario('nestjs-cls', withNestjsClsApp, options),
      },
    ];
    const rotation = (round - 1) % scenarios.length;
    const orderedScenarios = [...scenarios.slice(rotation), ...scenarios.slice(0, rotation)];

    let baseline;
    let requestContext;
    let nestjsCls;

    for (const scenario of orderedScenarios) {
      const result = await scenario.run();
      if (scenario.id === 'request-scoped') {
        baseline = result;
      } else if (scenario.id === 'request-context') {
        requestContext = result;
      } else {
        nestjsCls = result;
      }
    }

    baselineRuns.push(baseline);
    requestContextRuns.push(requestContext);
    nestjsClsRuns.push(nestjsCls);
    console.log(
      `Round ${round}: baseline=${baseline.ms.toFixed(2)}ms, request-context=${requestContext.ms.toFixed(2)}ms, nestjs-cls=${nestjsCls.ms.toFixed(2)}ms`
    );
  }

  const baselineMsMedian = median(baselineRuns.map((r) => r.ms));
  const requestContextMsMedian = median(requestContextRuns.map((r) => r.ms));
  const nestjsClsMsMedian = median(nestjsClsRuns.map((r) => r.ms));
  const baselineRpsMedian = median(baselineRuns.map((r) => r.rps));
  const requestContextRpsMedian = median(requestContextRuns.map((r) => r.rps));
  const nestjsClsRpsMedian = median(nestjsClsRuns.map((r) => r.rps));
  const baselineUsMedian = median(baselineRuns.map((r) => r.usPerRequest));
  const requestContextUsMedian = median(requestContextRuns.map((r) => r.usPerRequest));
  const nestjsClsUsMedian = median(nestjsClsRuns.map((r) => r.usPerRequest));
  const baselinePeakHeapMedian = median(baselineRuns.map((r) => r.memory?.peakHeapDeltaMb ?? 0));
  const requestContextPeakHeapMedian = median(
    requestContextRuns.map((r) => r.memory?.peakHeapDeltaMb ?? 0)
  );
  const nestjsClsPeakHeapMedian = median(nestjsClsRuns.map((r) => r.memory?.peakHeapDeltaMb ?? 0));
  const baselineRetainedMedian = median(baselineRuns.map((r) => r.memory?.heapRetainedMb ?? 0));
  const requestContextRetainedMedian = median(
    requestContextRuns.map((r) => r.memory?.heapRetainedMb ?? 0)
  );
  const nestjsClsRetainedMedian = median(nestjsClsRuns.map((r) => r.memory?.heapRetainedMb ?? 0));
  const baselineRssMedian = median(baselineRuns.map((r) => r.memory?.rssDeltaMb ?? 0));
  const requestContextRssMedian = median(requestContextRuns.map((r) => r.memory?.rssDeltaMb ?? 0));
  const nestjsClsRssMedian = median(nestjsClsRuns.map((r) => r.memory?.rssDeltaMb ?? 0));

  const speedup = baselineMsMedian / requestContextMsMedian;
  const timeSavedPct = ((baselineMsMedian - requestContextMsMedian) / baselineMsMedian) * 100;
  const speedupVsCls = nestjsClsMsMedian / requestContextMsMedian;
  const timeSavedVsClsPct =
    ((nestjsClsMsMedian - requestContextMsMedian) / nestjsClsMsMedian) * 100;
  const peakHeapDeltaPct = percentDelta(requestContextPeakHeapMedian, baselinePeakHeapMedian);

  console.log('');
  console.table([
    {
      scenario: 'Request-scoped provider (median)',
      total_ms: Number(baselineMsMedian.toFixed(2)),
      req_per_sec: Number(baselineRpsMedian.toFixed(2)),
      avg_us_per_request: Number(baselineUsMedian.toFixed(2)),
      peak_heap_delta_mb: Number(baselinePeakHeapMedian.toFixed(2)),
      retained_heap_mb: Number(baselineRetainedMedian.toFixed(2)),
      rss_delta_mb: Number(baselineRssMedian.toFixed(2)),
    },
    {
      scenario: '@pas7/nestjs-request-context (median)',
      total_ms: Number(requestContextMsMedian.toFixed(2)),
      req_per_sec: Number(requestContextRpsMedian.toFixed(2)),
      avg_us_per_request: Number(requestContextUsMedian.toFixed(2)),
      peak_heap_delta_mb: Number(requestContextPeakHeapMedian.toFixed(2)),
      retained_heap_mb: Number(requestContextRetainedMedian.toFixed(2)),
      rss_delta_mb: Number(requestContextRssMedian.toFixed(2)),
    },
    {
      scenario: 'nestjs-cls (median)',
      total_ms: Number(nestjsClsMsMedian.toFixed(2)),
      req_per_sec: Number(nestjsClsRpsMedian.toFixed(2)),
      avg_us_per_request: Number(nestjsClsUsMedian.toFixed(2)),
      peak_heap_delta_mb: Number(nestjsClsPeakHeapMedian.toFixed(2)),
      retained_heap_mb: Number(nestjsClsRetainedMedian.toFixed(2)),
      rss_delta_mb: Number(nestjsClsRssMedian.toFixed(2)),
    },
  ]);

  console.log('');
  console.log(`Median speedup: ${speedup.toFixed(2)}x faster`);
  console.log(`Median time saved: ${timeSavedPct.toFixed(2)}%`);
  console.log(`Median speedup vs nestjs-cls: ${speedupVsCls.toFixed(2)}x faster`);
  console.log(`Median time saved vs nestjs-cls: ${timeSavedVsClsPct.toFixed(2)}%`);
  console.log(`Median peak heap delta: ${peakHeapDeltaPct.toFixed(2)}% vs baseline`);
  console.log(
    `Median retained heap: baseline=${baselineRetainedMedian.toFixed(2)}MB, request-context=${requestContextRetainedMedian.toFixed(2)}MB`
  );
  console.log(
    `Median RSS delta: baseline=${baselineRssMedian.toFixed(2)}MB, request-context=${requestContextRssMedian.toFixed(2)}MB`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

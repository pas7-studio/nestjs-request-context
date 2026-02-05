import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import { AppController } from './app.controller';
import { RequestContextMiddleware } from './app.middleware';

@Module({
  imports: [
    RequestContextModule.forRoot({
      mode: 'standard',
    }),
  ],
  controllers: [AppController],
  providers: [RequestContextMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

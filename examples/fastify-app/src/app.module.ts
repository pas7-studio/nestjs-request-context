import { Module, MiddlewareConsumer } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import { AppController } from './app.controller';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';

@Module({
  imports: [
    RequestContextModule.forRoot({
      mode: 'standard', // збереження requestId, route, method
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  // Глобально застосовуємо Fastify middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestContextMiddleware()).forRoutes('*');
  }
}

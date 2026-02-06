import { Controller, Get, Param } from '@nestjs/common';
import { Ctx } from '@pas7/nestjs-request-context';
import { REQUEST_ID_KEY } from '@pas7/nestjs-request-context';

@Controller()
export class AppController {
  @Get()
  hello(@Ctx() store: Record<string, unknown>) {
    return {
      message: 'Hello from Fastify!',
      requestId: store[REQUEST_ID_KEY.name],
    };
  }
  
  @Get('user/:id')
  getUser(@Param('id') id: string, @Ctx(REQUEST_ID_KEY) requestId: string) {
    return {
      userId: id,
      requestId,
      message: 'User retrieved',
    };
  }
  
  @Get('error')
  error(@Ctx() store: Record<string, unknown>) {
    // Error flow не рве контекст
    throw new Error('Something went wrong!');
  }
}

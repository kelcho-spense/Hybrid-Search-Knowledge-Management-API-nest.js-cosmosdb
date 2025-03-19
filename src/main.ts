import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register the global exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Get ConfigService
  const configService = app.get(ConfigService);

  // Use ConfigService to get PORT value with fallback to 3000
  const port = configService.getOrThrow('PORT', 3000);
  await app.listen(port);
}
bootstrap();

import { Controller, Get } from '@nestjs/common';
import { AppService, GenerateResponse } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('generate-fake-knowledgeItems')
  generateFakeKnowledgeItems(): Promise<GenerateResponse> {
    return this.appService.generateFakeKnowledgeItems();
  }
}

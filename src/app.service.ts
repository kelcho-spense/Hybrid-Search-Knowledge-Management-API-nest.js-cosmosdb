import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from './database/database.service';
import { generateTextVector } from './utils/embedding';
import { faker } from '@faker-js/faker';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async generateFakeKnowledgeItems(knowledgeItemsNumber: number = 20): Promise<string> {
    

    return `Successfully generated and inserted ${3} knowledgeItems`;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import {
  KnowledgeItem,
  Department,
  ItemType,
  ProjectContext,
} from './knowledge-items/entities/knowledge-item.entity';
import { faker } from '@faker-js/faker';
import { generateTextVector } from './utils/embedding';

export interface GenerateResponse {
  message: string;
  success: boolean;
  count?: number;
  error?: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async generateFakeKnowledgeItems(count = 20): Promise<GenerateResponse> {
    try {
      const items: KnowledgeItem[] = [];
      const knowledgeItemContainer = this.databaseService.getContainer();

      for (let i = 0; i < count; i++) {
        const title = faker.company.catchPhrase();
        const content = faker.lorem.paragraphs(3);
        const metadata = {
          author: faker.person.fullName(),
          version: '1.0',
          tags: Array.from({ length: 3 }, () => faker.word.words(2)),
          department: faker.helpers.enumValue(Department),
          projectContext: faker.helpers.enumValue(ProjectContext),
        };

        const contentVector = await generateTextVector(content);
        const metadataText = `${title} ${metadata.tags.join(' ')} ${metadata.department} ${metadata.projectContext}`;
        const metadataVector = await generateTextVector(metadataText);

        const item: KnowledgeItem = {
          id: faker.string.uuid(),
          title,
          content,
          itemType: faker.helpers.enumValue(ItemType),
          dateCreated: faker.date.past(),
          metadata,
          contentVector,
          metadataVector,
        };

        items.push(item);
      }

      let insertedCount = 0;
      for (const item of items) {
        await knowledgeItemContainer.items.create(item);
        insertedCount++;
      }

      return {
        message: `Successfully generated ${insertedCount} documents`,
        success: true,
        count: insertedCount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate items: ${error.message}`);
      return {
        message: 'Failed to generate items',
        success: false,
        error: error.message,
      };
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}

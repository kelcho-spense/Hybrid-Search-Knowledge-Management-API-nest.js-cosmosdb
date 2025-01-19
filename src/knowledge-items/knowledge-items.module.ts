// src/knowledge-items/knowledge-items.module.ts
import { Module } from '@nestjs/common';
import { KnowledgeItemsService } from './knowledge-items.service';
import { KnowledgeItemsController } from './knowledge-items.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [KnowledgeItemsController],
  providers: [KnowledgeItemsService],
})
export class KnowledgeItemsModule {}
import { Module } from '@nestjs/common';
import { KnowledgeItemsService } from './knowledge-items.service';
import { KnowledgeItemsController } from './knowledge-items.controller';

@Module({
  controllers: [KnowledgeItemsController],
  providers: [KnowledgeItemsService],
})
export class KnowledgeItemsModule {}

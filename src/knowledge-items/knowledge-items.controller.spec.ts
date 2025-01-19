import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeItemsController } from './knowledge-items.controller';
import { KnowledgeItemsService } from './knowledge-items.service';

describe('KnowledgeItemsController', () => {
  let controller: KnowledgeItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnowledgeItemsController],
      providers: [KnowledgeItemsService],
    }).compile();

    controller = module.get<KnowledgeItemsController>(KnowledgeItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

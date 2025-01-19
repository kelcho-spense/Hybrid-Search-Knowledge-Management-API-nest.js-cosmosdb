import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeItemsService } from './knowledge-items.service';

describe('KnowledgeItemsService', () => {
  let service: KnowledgeItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeItemsService],
    }).compile();

    service = module.get<KnowledgeItemsService>(KnowledgeItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

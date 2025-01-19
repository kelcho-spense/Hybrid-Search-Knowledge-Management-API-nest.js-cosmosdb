import { Injectable } from '@nestjs/common';
import { CreateKnowledgeItemDto } from './dto/create-knowledge-item.dto';
import { UpdateKnowledgeItemDto } from './dto/update-knowledge-item.dto';

@Injectable()
export class KnowledgeItemsService {
  create(createKnowledgeItemDto: CreateKnowledgeItemDto) {
    return 'This action adds a new knowledgeItem';
  }

  findAll() {
    return `This action returns all knowledgeItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} knowledgeItem`;
  }

  update(id: number, updateKnowledgeItemDto: UpdateKnowledgeItemDto) {
    return `This action updates a #${id} knowledgeItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} knowledgeItem`;
  }
}

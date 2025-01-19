import { PartialType } from '@nestjs/mapped-types';
import { CreateKnowledgeItemDto } from './create-knowledge-item.dto';

export class UpdateKnowledgeItemDto extends PartialType(CreateKnowledgeItemDto) {}

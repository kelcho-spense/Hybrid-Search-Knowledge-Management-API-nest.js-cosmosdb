// src/knowledge-items/dto/create-knowledge-item.dto.ts
export class CreateKnowledgeItemDto {
  title: string;
  content: string;
  itemType: string;
  metadata: {
    author: string;
    tags: string[];
    department: string;
    projectContext?: string;
  };
}

// src/knowledge-items/dto/search-query.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  searchText: string;

  @IsOptional()
  @IsNumber()
  top: number = 10;

  @IsOptional()
  @IsString()
  projectContext?: string;
}

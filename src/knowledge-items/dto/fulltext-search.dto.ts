import { Department } from '../entities/knowledge-item.entity';

export interface fullTextSearchDto {
  searchText: string;
  top: number;
}

export interface titleFullTextSearchDto extends fullTextSearchDto {
  title?: string;
}

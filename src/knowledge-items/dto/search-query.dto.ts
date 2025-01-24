import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Department } from '../entities/knowledge-item.entity';

export enum SearchType {
  HYBRID = 'hybrid',
  VECTOR = 'vector',
  TEXT = 'text',
  SEMANTIC = 'semantic',
  MULTI_VECTOR = 'multi_vector',
}

export class SearchQueryDto {
  @IsString()
  searchText: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  top: number = 10;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsEnum(SearchType)
  searchType?: SearchType = SearchType.HYBRID;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  weightVector?: number = 0.5;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  weightText?: number = 0.5;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  minScore?: number = 0.0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  weightContent?: number = 0.7;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  weightMetadata?: number = 0.3;
}

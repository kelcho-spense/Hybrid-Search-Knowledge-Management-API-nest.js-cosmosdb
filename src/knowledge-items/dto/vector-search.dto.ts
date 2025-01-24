import { ProjectContext, Department } from '../entities/knowledge-item.entity';
export interface VectorSearchDto {
  searchText: string;
  top: number;
}

export interface departmentVectorSearchDto extends VectorSearchDto {
  department?: Department;
}

export interface contentVectorSearchDto extends VectorSearchDto {
  content?: string;
}

export interface projectContextVectorSearchDto extends VectorSearchDto {
  projectContext?: ProjectContext;
}

// combine projectContextVectorSearchDto and departmentVectorSearchDto
export interface metadataVectorSearchDto extends VectorSearchDto {
  projectContext?: ProjectContext;
  department?: Department;
}

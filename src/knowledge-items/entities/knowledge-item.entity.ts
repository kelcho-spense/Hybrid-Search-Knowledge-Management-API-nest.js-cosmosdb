// src/knowledge-items/entities/knowledge-item.entity.ts

export enum Department {
  PMO = 'PMO',
  Engineering = 'Engineering',
  HR = 'HR',
  Finance = 'Finance',
  Marketing = 'Marketing',
}

export enum ItemType {
  BestPractice = 'bestPractice',
  Procedure = 'procedure',
  Policy = 'policy',
  Template = 'template',
  Guide = 'guide',
}

export enum ProjectContext {
  Enterprise = 'enterprise',
  Department = 'department',
  Team = 'team',
  Individual = 'individual',
}

export class KnowledgeItem {
  id: string;
  title: string;
  content: string;
  itemType: ItemType;
  dateCreated: Date;
  metadata: {
    author: string;
    version: string;
    tags: string[];
    department: Department;
    projectContext?: ProjectContext;
  };
  contentVector?: number[];
  metadataVector?: number[];
}

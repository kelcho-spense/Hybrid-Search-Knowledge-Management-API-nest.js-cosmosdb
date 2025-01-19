// src/knowledge-items/entities/knowledge-item.entity.ts
export class KnowledgeItem {
  id: string;
  title: string;
  content: string;
  itemType: string;
  dateCreated: Date;
  metadata: {
    author: string;
    version: string;
    tags: string[];
    department: string;
    projectContext?: string;
  };
  contentVector?: number[];
}

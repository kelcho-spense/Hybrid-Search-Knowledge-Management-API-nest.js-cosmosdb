// src/knowledge-items/knowledge-items.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  contentVectorSearchDto,
  CreateKnowledgeItemDto,
  fullTextSearchDto,
  hybridSearchContentDto,
  metadataVectorSearchDto,
} from './dto';
import { generateTextVector } from '../utils/embedding';

@Injectable()
export class KnowledgeItemsService {
  constructor(private readonly databaseService: DatabaseService) {}
  // create method
  async create(params: CreateKnowledgeItemDto) {
    const contentVector = await generateTextVector(params.content.trim());
    const container = this.databaseService.getContainer();

    const item = {
      ...params,
      contentVector,
      dateCreated: new Date(),
    };

    const { resource } = await container.items.create(item);
    return resource;
  }
  // allKnowledgeItems method
  async allKnowledgeItems() {
    const container = this.databaseService.getContainer();

    const { resources } = await container.items
      .query(
        `
        SELECT 
        c.id, 
        c.title, 
        c.content, 
        c.itemType, 
        c.metadata, 
        c.dateCreated
        FROM c `,
      )
      .fetchAll();
    return resources;
  }
  // vectorSearchContent method
  async vectorSearchContent(params: contentVectorSearchDto) {
    if (params.top === undefined) {
      params.top = 10;
    }
    const container = this.databaseService.getContainer();
    const searchVector = await generateTextVector(params.searchText.trim());

    const querySpec = {
      query: `
        SELECT TOP @top
        c.id, 
        c.title, 
        c.content, 
        c.itemType, 
        c.metadata, 
        c.dateCreated,
        VectorDistance(c.contentVector, @searchVector) as SimilarityScore
        FROM c
        WHERE c.metadata.projectContext = @projectContext
        ORDER BY VectorDistance(c.contentVector, @searchVector)`,
      parameters: [
        { name: '@top', value: params.top },
        { name: '@searchVector', value: searchVector },
        { name: '@projectContext', value: params.projectContext },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
  // vectorSearchMetadata method
  async vectorSearchMetadata(params: metadataVectorSearchDto) {
    if (params.top === undefined) {
      params.top = 10;
    }
    const container = this.databaseService.getContainer();
    const vectorSearchQuery = await generateTextVector(
      params.searchText.trim(),
    );

    const querySpec = {
      query: `
      SELECT TOP @top
        c.id,
        c.title,
        c.content,
        c.itemType,
        c.metadata,
        c.dateCreated,
        VectorDistance(c.metadataVector, @searchVector) AS SimilarityScore
      FROM c
      WHERE c.metadata.department = @department
        AND c.metadata.projectContext = @projectContext
      ORDER BY VectorDistance(c.metadataVector, @searchVector)`,
      parameters: [
        { name: '@top', value: params.top },
        { name: '@department', value: params.department },
        { name: '@projectContext', value: params.projectContext },
        { name: '@searchVector', value: vectorSearchQuery },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
  // full-textSearchTitle method
  async titleFullTextSearch({ searchText, top = 10 }: fullTextSearchDto) {
    const container = this.databaseService.getContainer();
    const keywords = searchText.split(' ').filter((k) => k.length > 0);

    const querySpec = {
      query: `
        SELECT TOP @top
          c.id,
          c.title,
          c.content,
          c.itemType,
          c.dateCreated,
          c.metadata
        FROM c 
        WHERE FullTextContainsAny(c.title, ${keywords.map((_, i) => `@kw${i}`).join(', ')})
        ORDER BY c._ts DESC
      `,
      parameters: [
        ...keywords.map((kw, i) => ({ name: `@kw${i}`, value: kw })),
        { name: '@top', value: top },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
  //full-textSearchContent method
  async contentFullTextSearch({ searchText, top = 10 }: fullTextSearchDto) {
    const container = this.databaseService.getContainer();
    const keywords = searchText.split(' ').filter((k) => k.length > 0);

    const querySpec = {
      query: `
        SELECT TOP @top
          c.id,
          c.title,
          c.content,
          c.itemType,
          c.dateCreated,
          c.metadata
        FROM c 
        WHERE FullTextContainsAny(c.content, ${keywords.map((_, i) => `@kw${i}`).join(', ')})
        ORDER BY c._ts DESC
      `,
      parameters: [
        ...keywords.map((kw, i) => ({ name: `@kw${i}`, value: kw })),
        { name: '@top', value: top },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
  // hybridSearchContent method
  async hybridSearchContent({ searchText, top = 10 }: hybridSearchContentDto) {
    const container = this.databaseService.getContainer();

    // Generate vector and prepare search terms
    const searchVector = await generateTextVector(searchText.trim());
    const searchTerms = searchText.split(' ').filter((term) => term.length > 0);

    //     Construct query with proper RRF syntax
    //     `SELECT TOP 10 * FROM c ORDER BY RANK RRF(FullTextScore(c.text, ["keyword"]), VectorDistance(c.vector, [1,2,3]))`
    const querySpec = {
      query: `
          SELECT TOP ${top}
            c.id,
            c.title,
            c.content,
            c.itemType,
            c.dateCreated,
            c.metadata
          FROM c
          ORDER BY RANK RRF(
            FullTextScore(c.content, [${searchTerms.map((i) => `"${i}"`).join(', ')}]),
            VectorDistance(c.content, @searchVector))`,
      parameters: [{ name: '@searchVector', value: searchVector }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
}

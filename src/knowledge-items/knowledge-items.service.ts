// src/knowledge-items/knowledge-items.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  contentVectorSearchDto,
  CreateKnowledgeItemDto,
  metadataVectorSearchDto,
  titleFullTextSearchDto,
} from './dto';
import { generateTextVector } from '../utils/embedding';

@Injectable()
export class KnowledgeItemsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createKnowledgeItemDto: CreateKnowledgeItemDto) {
    const contentVector = await generateTextVector(
      createKnowledgeItemDto.content,
    );
    const container = this.databaseService.getContainer();

    const item = {
      ...createKnowledgeItemDto,
      contentVector,
      dateCreated: new Date(),
    };

    const { resource } = await container.items.create(item);
    return resource;
  }
  // vectorSearchContent method
  async vectorSearchContent(params: contentVectorSearchDto) {
    const topCount = parseInt(params.top.toString(), 10);
    const container = this.databaseService.getContainer();
    const searchVector = await generateTextVector(params.searchText);

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
        ORDER BY VectorDistance(c.contentVector, @searchVector)`,
      parameters: [
        { name: '@top', value: topCount },
        { name: '@searchVector', value: searchVector },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
  // vectorSearchMetadata method
  async vectorSearchMetadata(params: metadataVectorSearchDto) {
    const topCount = parseInt(params.top.toString(), 10);
    const container = this.databaseService.getContainer();

    const vectorSearchQuery = await generateTextVector(params.searchText);

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
        { name: '@top', value: topCount },
        { name: '@department', value: params.department },
        { name: '@projectContext', value: params.projectContext },
        { name: '@searchVector', value: vectorSearchQuery },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
  // titleFullTextSearch method
  // async titleFullTextSearch(params: titleFullTextSearchDto) {
  //   const topCount = parseInt(params.top.toString(), 10);
  //   const container = this.databaseService.getContainer();
  //   const searchTerms = params.searchText.split(' ');

  //   const querySpec = {
  //     query: `
  //     SELECT TOP @top 
  //       c.id,
  //       c.title,
  //       c.content,
  //       c.itemType,
  //       c.metadata,
  //       c.dateCreated
  //     FROM c
  //     WHERE FullTextContains(c.title, ${JSON.stringify(searchTerms)})
  //     ORDER BY RANK FullTextScore(c.title, ${JSON.stringify(searchTerms)})`,
  //     parameters: [
  //       { name: '@top', value: topCount },
  //     ],
  //   };

  //   const { resources } = await container.items.query(querySpec).fetchAll();
  //   return resources;
  // }

  async titleFullTextSearch(searchText: string, top: number = 10) {
    const container = this.databaseService.getContainer();
    const keywords = searchText.split(' ').filter(k => k.length > 0);

    const querySpec = {
      query: `
        SELECT TOP @top *
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

  // async hybridSearchDepartment(params: VectorSearchDto) {
  //   const container = this.databaseService.getContainer();
  //   const searchVector = await generateTextVector(params.searchText);

  //   const querySpec = {
  //     query: `
  //       SELECT TOP @top *
  //       FROM c
  //       WHERE c.metadata.department = @department
  //       ORDER BY RANK RRF(
  //         VectorDistance(c.contentVector, @searchVector),
  //         FullTextScore(c.content, @searchTerms)
  //       )`,
  //     parameters: [
  //       { name: '@top', value: params.top },
  //       { name: '@department', value: params.department },
  //       { name: '@searchVector', value: searchVector },
  //       { name: '@searchTerms', value: params.searchText.split(' ') },
  //     ],
  //   };

  //   const { resources } = await container.items.query(querySpec).fetchAll();
  //   return resources;
  // }
}

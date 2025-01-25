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

  async titleFullTextSearch(titleFullTextSearchDto: fullTextSearchDto) {
    let top = 10;
    const container = this.databaseService.getContainer();
    const keywords = titleFullTextSearchDto.searchText
      .split(' ')
      .filter((k) => k.length > 0);
    if (titleFullTextSearchDto.top) {
      top = parseInt(titleFullTextSearchDto.top.toString(), 10);
    }

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

  async contentFullTextSearch(params: fullTextSearchDto) {
    let top = 10;
    const container = this.databaseService.getContainer();
    const keywords = params.searchText.split(' ').filter((k) => k.length > 0);
    if (params.top) {
      top = parseInt(params.top.toString(), 10);
    }

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

  // async hybridSearchContent(params: hybridSearchContentDto) {
  //   let top = 10;
  //   const container = this.databaseService.getContainer();
  //   const searchVector = await generateTextVector(params.searchText);
  //   const searchText = params.searchText.split(' ').filter((k) => k.length > 0);
  //   if (params.top) {
  //     top = parseInt(params.top.toString(), 10);
  //   }
  //   // https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/query/rrf
  //   const querySpec = {
  //     query: `
  //       SELECT TOP ${top}
  //         c.id,
  //         c.title,
  //         c.content,
  //         c.itemType,
  //         c.dateCreated,
  //         c.metadata
  //       FROM c
  //       ORDER BY RANK RRF(
  //         VectorDistance(c.contentVector, @searchVector),
  //         ${searchText.length > 0 ? `FullTextScore(c.content, [${searchText.map((_, idx) => `@searchTerm${idx}`).join(', ')}])` : ''}
  //       )`,
  //     parameters: [
  //       { name: '@searchVector', value: searchVector },
  //       ...searchText.map((kw, idx) => ({
  //         name: `@searchTerm${idx}`,
  //         value: kw,
  //       })),
  //     ],
  //   };

  //   const { resources } = await container.items.query(querySpec).fetchAll();
  //   return resources;
  // }

  async hybridSearchContent(params: hybridSearchContentDto) {
    let top = 10;
    const container = this.databaseService.getContainer();

    // Generate vector and prepare search terms
    const searchVector = await generateTextVector('Demonstro, portal');
    const searchTerms = params.searchText
      .split(' ')
      .filter((term) => term.length > 0);
    if (params.top) {
      top = parseInt(params.top.toString(), 10);
      if (isNaN(top)) {
        throw new Error("The 'top' parameter must be a valid number.");
      }
    }

    //     Construct query with proper RRF syntax
    //     `SELECT TOP 10 *
    //       FROM c
    //      ORDER BY RANK RRF(
    //        FullTextScore(c.text, ["keyword"]),
    //        VectorDistance(c.vector, [1,2,3]))`
    const querySpec = {
      query: `
          SELECT TOP 3
            c.id,
            c.title,
            c.content,
            c.itemType,
            c.dateCreated,
            c.metadata
          FROM c
          ORDER BY RANK RRF(FullTextScore(c.title, ["portal", "Demonstro"]),
            VectorDistance(c.metadataVector, @searchVector))`,
      parameters: [{ name: '@searchVector', value: searchVector }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
}

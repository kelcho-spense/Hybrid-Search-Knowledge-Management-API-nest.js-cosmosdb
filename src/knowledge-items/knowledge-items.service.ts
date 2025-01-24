// src/knowledge-items/knowledge-items.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateKnowledgeItemDto, SearchQueryDto } from './dto';
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

  async searchByContent(query: SearchQueryDto) {
    const container = this.databaseService.getContainer();
    const searchVector = await generateTextVector(query.searchText);

    // Vector search query
    const vectorQuery = {
      query: `
        SELECT TOP @top c.*, 
        st_distance(c.contentVector, @searchVector) as vectorDistance
        FROM c 
        ORDER BY vectorDistance ASC`,
      parameters: [
        { name: '@searchVector', value: searchVector },
        { name: '@top', value: query.top },
      ],
    };

    // Full-text search query
    const textQuery = {
      query: `
        SELECT TOP @top c.*, 
        1 as textScore
        FROM c 
        WHERE CONTAINS(c.content, @searchText, true)
        ORDER BY c._ts DESC`,
      parameters: [
        { name: '@searchText', value: query.searchText },
        { name: '@top', value: query.top },
      ],
    };

    const [vectorResults, textResults] = await Promise.all([
      container.items.query(vectorQuery).fetchAll(),
      container.items.query(textQuery).fetchAll(),
    ]);

    return this.combineSearchResults(
      vectorResults.resources,
      textResults.resources,
      query.top,
    );
  }

  private combineSearchResults(
    vectorResults: any[],
    textResults: any[],
    k: number,
    constant: number = 60,
  ): any[] {
    const scoreMap = new Map<string, { item: any; score: number }>();

    vectorResults.forEach((item, index) => {
      const rrf = 1 / (constant + index + 1);
      scoreMap.set(item.id, { item, score: rrf });
    });

    textResults.forEach((item, index) => {
      const rrf = 1 / (constant + index + 1);
      if (scoreMap.has(item.id)) {
        scoreMap.get(item.id).score += rrf;
      } else {
        scoreMap.set(item.id, { item, score: rrf });
      }
    });

    return Array.from(scoreMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((entry) => ({
        ...entry.item,
        relevanceScore: entry.score,
      }));
  }
}

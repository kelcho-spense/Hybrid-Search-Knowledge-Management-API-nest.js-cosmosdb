// src/knowledge-items/knowledge-items.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { KnowledgeItemsService } from './knowledge-items.service';
import { CreateKnowledgeItemDto } from './dto/create-knowledge-item.dto';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('knowledge-items')
export class KnowledgeItemsController {
  constructor(private readonly knowledgeItemsService: KnowledgeItemsService) {}

  @Post()
  create(@Body() createKnowledgeItemDto: CreateKnowledgeItemDto) {
    return this.knowledgeItemsService.create(createKnowledgeItemDto);
  }

  @Get('search')
  async search(@Query() query: SearchQueryDto) {
    return this.knowledgeItemsService.searchByContent(query);
  }
}

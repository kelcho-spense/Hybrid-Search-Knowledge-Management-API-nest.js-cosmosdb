// src/knowledge-items/knowledge-items.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { KnowledgeItemsService } from './knowledge-items.service';
import { CreateKnowledgeItemDto } from './dto/create-knowledge-item.dto';
import { fullTextSearchDto, metadataVectorSearchDto } from './dto';

@Controller('knowledge-items')
export class KnowledgeItemsController {
  constructor(private readonly knowledgeItemsService: KnowledgeItemsService) {}

  @Post()
  create(@Body() createKnowledgeItemDto: CreateKnowledgeItemDto) {
    return this.knowledgeItemsService.create(createKnowledgeItemDto);
  }

  @Get('all')
  async allKnowledgeItems() {
    return this.knowledgeItemsService.allKnowledgeItems();
  }

  @Get('vector-search-metadata')
  async vectorSearchMetadata(
    @Query(ValidationPipe) query: metadataVectorSearchDto,
  ) {
    return this.knowledgeItemsService.vectorSearchMetadata(query);
  }

  @Get('vector-search-content')
  async vectorSearchContent(
    @Query(ValidationPipe) query: metadataVectorSearchDto,
  ) {
    return this.knowledgeItemsService.vectorSearchContent(query);
  }

  @Get('text-search-title')
  async titleFullTextSearch(@Query(ValidationPipe) query: fullTextSearchDto) {
    return this.knowledgeItemsService.titleFullTextSearch(query);
  }

  @Get('text-search-content')
  async contentFullTextSearch(@Query(ValidationPipe) query: fullTextSearchDto) {
    return this.knowledgeItemsService.contentFullTextSearch(query);
  }

  // @Get('hybrid-search-department')
  // async semanticSearchDepartment(@Query() query: VectorSearchDto) {
  //   return this.knowledgeItemsService.hybridSearchDepartment(query);
  // }
}

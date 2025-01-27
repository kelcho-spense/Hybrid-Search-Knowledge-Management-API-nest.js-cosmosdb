// src/knowledge-items/knowledge-items.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  ParseIntPipe,
  ParseEnumPipe,
  Optional,
} from '@nestjs/common';
import { KnowledgeItemsService } from './knowledge-items.service';
import { CreateKnowledgeItemDto } from './dto/create-knowledge-item.dto';
import {
  fullTextSearchDto,
  hybridSearchContentDto,
  metadataVectorSearchDto,
} from './dto';
import { Department, ProjectContext } from './entities/knowledge-item.entity';

@Controller('knowledge-items')
export class KnowledgeItemsController {
  constructor(private readonly knowledgeItemsService: KnowledgeItemsService) { }

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
    @Query('searchText', ValidationPipe) searchText: string,
    @Query('department', new ParseEnumPipe(Department))
    department: Department,
    @Query('projectContext', new ParseEnumPipe(ProjectContext))
    projectContext: ProjectContext,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.knowledgeItemsService.vectorSearchMetadata({
      searchText,
      top,
      department,
      projectContext,
    });
  }

  @Get('vector-search-content')
  async vectorSearchContent(
    @Query('searchText', ValidationPipe) searchText: string,
    @Query('projectContext', new ParseEnumPipe(ProjectContext))
    projectContext: ProjectContext,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.knowledgeItemsService.vectorSearchContent({
      searchText,
      top,
      projectContext,
    });
  }

  @Get('text-search-title')
  async titleFullTextSearch(@Query(ValidationPipe) query: fullTextSearchDto) {
    return this.knowledgeItemsService.titleFullTextSearch(query);
  }

  @Get('text-search-content')
  async contentFullTextSearch(@Query(ValidationPipe) query: fullTextSearchDto) {
    return this.knowledgeItemsService.contentFullTextSearch(query);
  }

  @Get('hybrid-search-content')
  async hybridSearchContent(
    @Query(ValidationPipe) query: hybridSearchContentDto,
  ) {
    return this.knowledgeItemsService.hybridSearchContent(query);
  }
}

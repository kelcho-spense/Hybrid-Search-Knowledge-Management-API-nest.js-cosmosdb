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
  Delete,
} from '@nestjs/common';
import { KnowledgeItemsService } from './knowledge-items.service';
import { CreateKnowledgeItemDto } from './dto/create-knowledge-item.dto';
import { Department, ProjectContext } from './entities/knowledge-item.entity';

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
  async titleFullTextSearch(
    @Query('searchText', ValidationPipe) searchText: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.knowledgeItemsService.titleFullTextSearch({ searchText, top });
  }

  @Get('text-search-content')
  async contentFullTextSearch(
    @Query('searchText', ValidationPipe) searchText: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.knowledgeItemsService.contentFullTextSearch({
      searchText,
      top,
    });
  }

  @Get('hybrid-search-content')
  async hybridSearchContent(
    @Query('searchText', ValidationPipe) searchText: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.knowledgeItemsService.hybridSearchContent({
      searchText,
      top,
    });
  }

  @Delete()
  async deleteKnowledgeItem() {
    return this.knowledgeItemsService.deleteAll();
  }
}

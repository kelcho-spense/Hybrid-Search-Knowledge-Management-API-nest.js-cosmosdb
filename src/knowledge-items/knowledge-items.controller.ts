import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KnowledgeItemsService } from './knowledge-items.service';
import { CreateKnowledgeItemDto } from './dto/create-knowledge-item.dto';
import { UpdateKnowledgeItemDto } from './dto/update-knowledge-item.dto';

@Controller('knowledge-items')
export class KnowledgeItemsController {
  constructor(private readonly knowledgeItemsService: KnowledgeItemsService) {}

  @Post()
  create(@Body() createKnowledgeItemDto: CreateKnowledgeItemDto) {
    return this.knowledgeItemsService.create(createKnowledgeItemDto);
  }

  @Get()
  findAll() {
    return this.knowledgeItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.knowledgeItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKnowledgeItemDto: UpdateKnowledgeItemDto) {
    return this.knowledgeItemsService.update(+id, updateKnowledgeItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.knowledgeItemsService.remove(+id);
  }
}

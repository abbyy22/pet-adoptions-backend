import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto.js';
import { QueryPetDto } from './dto/query-pet.dto.js';
import { UpdatePetDto } from './dto/update-pet.dto.js';
import { PetsService } from './pets.service.js';

@Controller('pets')
export class PetsController {
  // Service di-inject oleh Nest (dependency injection), tidak dibuat dengan `new`.
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @Get()
  findAll(@Query() query: QueryPetDto) {
    return this.petsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.remove(id);
  }
}

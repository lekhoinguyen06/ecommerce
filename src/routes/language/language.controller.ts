import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import {
  CreateLanguageDTO,
  GetLanguageDetailResDTO,
  GetLanguagesResDTO,
  UpdateLanguageDTO,
} from './language.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { MessageResDTO } from 'src/shared/dto/response.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @ZodSerializerDto(GetLanguageDetailResDTO)
  create(
    @Body() createLanguageDto: CreateLanguageDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.languageService.create(createLanguageDto, userId);
  }

  @Post(':id/restore')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  restore(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return this.languageService.restore(id, userId);
  }

  @Get()
  @ZodSerializerDto(GetLanguagesResDTO)
  findAll() {
    return this.languageService.findAll();
  }

  @Get(':id')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  findOne(@Param('id') id: string) {
    return this.languageService.findOne(id);
  }

  @Patch(':id')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  update(
    @Body() updateLanguageDto: UpdateLanguageDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.languageService.update(updateLanguageDto, userId);
  }

  @Delete(':id')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return this.languageService.delete(id, userId);
  }
}

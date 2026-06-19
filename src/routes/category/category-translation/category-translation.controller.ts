import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryTranslationService } from './category-translation.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateCategoryTranslationBodyDTO,
  GetCategoryTranslationDetailResDTO,
  GetCategoryTranslationParamDTO,
  UpdateCategoryTranslationBodyDTO,
} from './category-translation.dto';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dto/response.dto';

@Controller('category-translation')
export class CategoryTranslationController {
  constructor(
    private readonly categoryTranslationService: CategoryTranslationService,
  ) {}

  @Get(':categoryTranslationId')
  @IsPublic()
  @ZodSerializerDto(GetCategoryTranslationDetailResDTO)
  findById(@Param() params: GetCategoryTranslationParamDTO) {
    return this.categoryTranslationService.findById(
      params.categoryTranslationId,
    );
  }

  @Post()
  @ZodSerializerDto(GetCategoryTranslationDetailResDTO)
  create(
    @Body() body: CreateCategoryTranslationBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryTranslationService.create({
      ...body,
      createdById: userId,
    });
  }

  @Put(':categoryTranslationId')
  @ZodSerializerDto(GetCategoryTranslationDetailResDTO)
  update(
    @Param() params: GetCategoryTranslationParamDTO,
    @Body() body: UpdateCategoryTranslationBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryTranslationService.update({
      id: params.categoryTranslationId,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':categoryTranslationId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetCategoryTranslationParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryTranslationService.delete({
      id: params.categoryTranslationId,
      deletedById: userId,
    });
  }
}

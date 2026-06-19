import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BrandTranslationService } from './brand-translation.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateBrandTranslationBodyDTO,
  GetBrandTranslationDetailResDTO,
  GetBrandTranslationParamDTO,
  UpdateBrandTranslationBodyDTO,
} from './brand-translation.dto';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('brand-translation')
export class BrandTranslationController {
  constructor(
    private readonly brandTranslationService: BrandTranslationService,
  ) {}

  @Get(':brandTranslationId')
  @IsPublic()
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  findById(@Param() params: GetBrandTranslationParamDTO) {
    return this.brandTranslationService.findById(params.brandTranslationId);
  }

  @Post()
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  create(
    @Body() body: CreateBrandTranslationBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandTranslationService.create({
      ...body,
      createdById: userId,
    });
  }

  @Put(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  update(
    @Param() params: GetBrandTranslationParamDTO,
    @Body() body: UpdateBrandTranslationBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandTranslationService.update({
      id: params.brandTranslationId,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  delete(
    @Param() params: GetBrandTranslationParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandTranslationService.delete({
      id: params.brandTranslationId,
      deletedById: userId,
    });
  }
}

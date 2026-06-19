import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateBrandBodyDTO,
  GetBrandDetailResDTO,
  GetBrandParamDTO,
  GetBrandsResDTO,
  UpdateBrandBodyDTO,
} from './brand.dto';
import { PaginationQueryBodyDTO } from 'src/shared/dto/request.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dto/response.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetBrandsResDTO)
  list(@Query() query: PaginationQueryBodyDTO) {
    return this.brandService.list(query);
  }

  @Get(':brandId')
  @IsPublic()
  @ZodSerializerDto(GetBrandDetailResDTO)
  findById(@Param() params: GetBrandParamDTO) {
    return this.brandService.findById(params.brandId);
  }

  @Post()
  @ZodSerializerDto(GetBrandDetailResDTO)
  create(
    @Body() body: CreateBrandBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandService.create({ ...body, createdById: userId });
  }

  @Put(':brandId')
  @ZodSerializerDto(GetBrandDetailResDTO)
  update(
    @Param() params: GetBrandParamDTO,
    @Body() body: UpdateBrandBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandService.update({
      data: body,
      id: params.brandId,
      updatedById: userId,
    });
  }

  @Delete(':brandId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetBrandParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandService.delete(params.brandId, userId);
  }
}

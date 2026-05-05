import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreatePermissionDTO,
  GetPermissionQueryDTO,
  GetPermissionDetailResDTO,
  GetPermissionParamsDTO,
  GetPermissionResDTO,
  UpdatePermissionDTO,
} from './permission.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dto/response.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  get(@Param() param: GetPermissionParamsDTO) {
    return this.permissionService.findOne(param.permissionId);
  }

  // /permission?page=1&limit=10
  @Get()
  @ZodSerializerDto(GetPermissionResDTO)
  getAll(@Query() query: GetPermissionQueryDTO) {
    const { page, limit } = query;
    return this.permissionService.paginate({
      page: page,
      limit: limit,
    });
  }

  @Post()
  @ZodSerializerDto(GetPermissionDetailResDTO)
  create(
    @Body() body: CreatePermissionDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.create({ data: body, createdById: userId });
  }

  @Patch(':id')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  update(
    @Param() param: GetPermissionParamsDTO,
    @Body() body: UpdatePermissionDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.update({
      id: param.permissionId,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':permissionId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() param: GetPermissionParamsDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.delete({
      id: param.permissionId,
      deletedById: userId,
    });
  }

  @Post(':permissionId/restore')
  @ZodSerializerDto(MessageResDTO)
  restore(
    @Param() param: GetPermissionParamsDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.restore({
      id: param.permissionId,
      restoredById: userId,
    });
  }
}

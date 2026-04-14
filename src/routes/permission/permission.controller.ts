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
  GetPermissionResDTO,
  UpdatePermissionDTO,
} from './permission.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get(':id')
  @ZodSerializerDto(GetPermissionResDTO)
  get(@Param('id') id: string) {
    return this.permissionService.findOne(Number(id));
  }

  // /permission?page=1&limit=10
  @Get()
  @ZodSerializerDto(GetPermissionResDTO)
  getAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.permissionService.paginate({ page, limit });
  }

  @Post()
  @ZodSerializerDto(GetPermissionResDTO)
  create(
    @Body() body: CreatePermissionDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.create({ data: body, createdById: userId });
  }

  @Patch(':id')
  @ZodSerializerDto(GetPermissionResDTO)
  update(
    @Param('id') id: string,
    @Body() body: UpdatePermissionDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.update({
      id: Number(id),
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return this.permissionService.delete({
      id: Number(id),
      deletedById: userId,
    });
  }

  @Post(':id/restore')
  restore(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return this.permissionService.restore({
      id: Number(id),
      restoredById: userId,
    });
  }
}

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
import { RoleService } from './role.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() body: CreateRoleDTO, @ActiveUser('userId') userId: number) {
    return this.roleService.create({
      data: body,
      createdById: userId,
    });
  }

  @Get()
  paginate(@Query('page') page: number, @Query('limit') limit: number) {
    return this.roleService.paginate(page, limit);
  }

  @Get(':roleId')
  findOne(@Param('roleId') roleId: number) {
    return this.roleService.findOne(roleId);
  }

  @Patch(':roleId')
  update(
    @Param('roleId') roleId: number,
    @Body() body: UpdateRoleDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.update({
      id: roleId,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':roleId')
  delete(
    @Param('roleId') roleId: number,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.delete(roleId, userId);
  }

  @Post(':roleId/restore')
  restore(
    @Param('roleId') roleId: number,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.restore(roleId, userId);
  }
}

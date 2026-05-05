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
  paginate(@Query('page') page: string, @Query('limit') limit: string) {
    return this.roleService.paginate(Number(page), Number(limit));
  }

  @Get(':roleId')
  findOne(@Param('roleId') roleId: string) {
    return this.roleService.findOne(Number(roleId));
  }

  @Patch(':roleId')
  update(
    @Param('roleId') roleId: string,
    @Body() body: UpdateRoleDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.update({
      id: Number(roleId),
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':roleId')
  delete(
    @Param('roleId') roleId: string,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.delete(Number(roleId), userId);
  }

  @Post(':roleId/restore')
  restore(
    @Param('roleId') roleId: string,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.restore(Number(roleId), userId);
  }
}

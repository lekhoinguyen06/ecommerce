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
import {
  CreateRoleDTO,
  GetRoleDetailResDTO,
  GetRoleParamDTO,
  GetRoleQueryDTO,
  GetRolesResDTO,
  UpdateRoleDTO,
} from './role.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { MessageResDTO } from 'src/shared/dto/response.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ZodSerializerDto(GetRoleDetailResDTO)
  create(@Body() body: CreateRoleDTO, @ActiveUser('userId') userId: number) {
    return this.roleService.create({
      data: body,
      createdById: userId,
    });
  }

  @Get()
  @ZodSerializerDto(GetRolesResDTO)
  paginate(@Query() query: GetRoleQueryDTO) {
    return this.roleService.paginate(query.page, query.limit);
  }

  @Get(':roleId')
  @ZodSerializerDto(GetRoleDetailResDTO)
  findOne(@Param() params: GetRoleParamDTO) {
    return this.roleService.findOne(params.roleId);
  }

  @Patch(':roleId')
  @ZodSerializerDto(GetRoleDetailResDTO)
  update(
    @Param() params: GetRoleParamDTO,
    @Body() body: UpdateRoleDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.update({
      id: params.roleId,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':roleId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetRoleParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.delete(params.roleId, userId);
  }

  @Post(':roleId/restore')
  @ZodSerializerDto(MessageResDTO)
  restore(
    @Param() params: GetRoleParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.restore(params.roleId, userId);
  }
}

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
import { UserService } from './user.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUsersParamsDTO,
  GetUsersQueryDTO,
  GetUsersResDTO,
  UpdateUserBodyDTO,
  UpdateUserResDTO,
} from './user.dto';
import { GetUserProfileResDTO } from 'src/shared/dto/shared-user.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { ActiveRolePermissions } from 'src/shared/decorators/active-role-permissions.decorator';
import { MessageResDTO } from 'src/shared/dto/response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUsersResDTO)
  list(@Query() query: GetUsersQueryDTO) {
    return this.userService.list(query);
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserProfileResDTO)
  getProfile(@Param() params: GetUsersParamsDTO) {
    return this.userService.findById(params.userId);
  }

  @Post()
  @ZodSerializerDto(CreateUserResDTO)
  create(
    @Body() data: CreateUserBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string,
  ) {
    return this.userService.create({
      data,
      createdById: userId,
      createdByRoleName: roleName,
    });
  }

  @Put(':userId')
  @ZodSerializerDto(UpdateUserResDTO)
  update(
    @Body() data: UpdateUserBodyDTO,
    @Param() params: GetUsersParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string,
  ) {
    return this.userService.update({
      data,
      userId: params.userId,
      updatedById: userId,
      updatedByRoleName: roleName,
    });
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetUsersParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string,
  ) {
    return this.userService.delete({
      userId: params.userId,
      deletedById: userId,
      deletedByRoleName: roleName,
    });
  }

  @Post(':userId/restore')
  @ZodSerializerDto(MessageResDTO)
  restore(
    @Param() params: GetUsersParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string,
  ) {
    return this.userService.restore({
      userId: params.userId,
      restoredById: userId,
      restoredByRoleName: roleName,
    });
  }
}

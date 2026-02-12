import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType } from 'src/shared/constants/auth.constant';
import {
  CreatePostBodyDTO,
  GetPostItemDTO,
  UpdatePostBodyDTO,
} from './posts.dto';

@Controller('posts')
@Auth([AuthType.Bearer])
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body() body: CreatePostBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return new GetPostItemDTO(await this.postsService.create(userId, body));
  }

  @Get()
  async findAll(@ActiveUser('userId') userId: number) {
    return this.postsService
      .findAll(userId)
      .then((posts) => posts.map((post) => new GetPostItemDTO(post)));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new GetPostItemDTO(await this.postsService.findOne(Number(id)));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePostBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return new GetPostItemDTO(
      await this.postsService.update({
        postId: Number(id),
        authorId: userId,
        body,
      }),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(
      await this.postsService.delete(Number(id), userId),
    );
  }
}

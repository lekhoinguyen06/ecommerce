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
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType } from 'src/shared/constants/auth.constant';
import { GetPostItemDto } from './posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth([AuthType.Bearer])
  create(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser('userId') userId: number,
  ) {
    createPostDto.authorId = userId;
    return this.postsService.create(createPostDto);
  }

  @Get()
  @Auth([AuthType.Bearer])
  findAll(@ActiveUser('userId') userId: number) {
    return this.postsService
      .findAll(userId)
      .then((posts) => posts.map((post) => new GetPostItemDto(post)));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}

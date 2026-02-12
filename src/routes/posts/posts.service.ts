import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: createPostDto.authorId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  update(updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id: updatePostDto.id },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,
        authorId: updatePostDto.authorId,
      },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}

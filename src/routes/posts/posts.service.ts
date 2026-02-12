import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreatePostBodyDTO, UpdatePostBodyDTO } from './posts.dto';
import { isRequiredRecordNotFoundPrisma2025Error } from 'src/types/helper';

type UpdatePostProps = {
  postId: number;
  body: UpdatePostBodyDTO;
  authorId: number;
};

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}
  create(authorId: number, body: CreatePostBodyDTO) {
    return this.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
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

  async findOne(postId: number) {
    try {
      return await this.prisma.post.findUniqueOrThrow({
        where: { id: postId },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw new UnprocessableEntityException('Post not found');
      }
      throw error;
    }
  }

  async update({ postId, body, authorId }: UpdatePostProps) {
    try {
      return await this.prisma.post.update({
        where: { id: postId, authorId: authorId },
        data: {
          title: body.title,
          content: body.content,
        },
      });
    } catch (error: any) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw new UnprocessableEntityException('Post not found');
      }
      throw error;
    }
  }

  async delete(postId: number, authorId: number) {
    try {
      return await this.prisma.post.delete({
        where: { id: postId, authorId: authorId },
      });
    } catch (error: any) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw new UnprocessableEntityException('Post not found');
      }
      throw error;
    }
  }
}

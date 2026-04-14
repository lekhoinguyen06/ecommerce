import { Injectable } from '@nestjs/common';
import {
  CreateLanguageType,
  LanguageType,
  UpdateLanguageType,
} from './language.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class LanguageRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create({
    data,
    userId,
  }: {
    data: CreateLanguageType;
    userId: number;
  }): Promise<LanguageType> {
    return this.prismaService.language.create({
      data: {
        ...data,
        createdById: userId,
      },
    });
  }

  findAll(): Promise<LanguageType[]> {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  findOne(id: string): Promise<LanguageType | null> {
    return this.prismaService.language.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  update({
    data,
    userId,
  }: {
    data: UpdateLanguageType;
    userId: number;
  }): Promise<LanguageType> {
    return this.prismaService.language.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        updatedById: userId,
      },
    });
  }

  restore({
    id,
    userId,
  }: {
    id: string;
    userId: number;
  }): Promise<LanguageType> {
    return this.prismaService.language.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
        updatedById: userId,
      },
    });
  }

  delete({
    id,
    userId,
  }: {
    id: string;
    userId: number;
  }): Promise<LanguageType> {
    return this.prismaService.language.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedById: userId,
      },
    });
  }

  hardDelete(id: string): Promise<LanguageType> {
    return this.prismaService.language.delete({
      where: {
        id,
      },
    });
  }
}

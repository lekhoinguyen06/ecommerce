import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  BrandTranslationType,
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from './brand-translation.model';

@Injectable()
export class BrandTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({
    brandId,
    languageId,
    name,
    description,
    createdById,
  }: CreateBrandTranslationBodyType & { createdById?: number }) {
    return this.prismaService.brandTranslation.create({
      data: {
        brandId,
        languageId,
        name,
        description,
        createdById,
      },
    });
  }

  findById(id: number): Promise<BrandTranslationType | null> {
    return this.prismaService.brandTranslation.findUnique({
      where: { id, deletedAt: null },
    });
  }

  update({
    id,
    name,
    description,
    updatedById,
  }: UpdateBrandTranslationBodyType & {
    id: number;
    updatedById?: number;
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.update({
      where: { id, deletedAt: null },
      data: {
        name,
        description,
        updatedById,
      },
    });
  }

  delete(
    { id, deletedById }: { id: number; deletedById?: number },
    isHard?: boolean,
  ): Promise<BrandTranslationType> {
    if (isHard) {
      return this.prismaService.brandTranslation.delete({
        where: { id },
      });
    }
    return this.prismaService.brandTranslation.update({
      where: { id, deletedAt: null },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
}

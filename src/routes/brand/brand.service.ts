import { Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repo';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}
}

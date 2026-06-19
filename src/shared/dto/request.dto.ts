import { createZodDto } from 'nestjs-zod';
import {
  EmptyBodySchema,
  PaginationQueryBodySchema,
} from '../models/request.model';

export class EmptyBodyDTO extends createZodDto(EmptyBodySchema) {}
export class PaginationQueryBodyDTO extends createZodDto(
  PaginationQueryBodySchema,
) {}

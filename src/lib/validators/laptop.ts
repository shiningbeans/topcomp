import { z } from 'zod';

export const laptopQuerySchema = z.object({
  category: z.enum(['WORK', 'GAMING', 'APPLE']).optional(),
  brand: z.string().optional(), // Comma-separated
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRam: z.coerce.number().min(0).optional(),
  maxRam: z.coerce.number().min(0).optional(),
  minStorage: z.coerce.number().min(0).optional(),
  maxStorage: z.coerce.number().min(0).optional(),
  gpuBrand: z.string().optional(), // Comma-separated
  gpuModel: z.string().optional(), // Comma-separated
  cpuBrand: z.string().optional(), // Comma-separated
  cpuModel: z.string().optional(), // Comma-separated
  screenSize: z.string().optional(), // Comma-separated
  displayType: z.string().optional(), // Comma-separated
  touchscreen: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  os: z.string().optional(), // Comma-separated
  dealRating: z.enum(['GREAT', 'FAIR', 'ABOVE_AVERAGE']).optional(),
  sortBy: z.enum(['price', 'discount', 'reviewScore', 'newest']).default('price'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
});

export type LaptopQuery = z.infer<typeof laptopQuerySchema>;

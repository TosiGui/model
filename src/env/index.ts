import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error(_env.error.format());
    throw new Error('Environment validation error');
}

export const env = _env.data;
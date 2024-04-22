import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUseCase } from '../../services/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';

export async function register (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const userRepository = new PrismaUsersRepository();
        const registerService = new RegisterUseCase(userRepository);
        
        await registerService.execute({ name, email, password });

    } catch (error: any) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
    return reply.status(201).send();
}
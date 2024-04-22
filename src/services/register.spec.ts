import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let UsersRepository: InMemoryUsersRepository;
let registerUseCase: RegisterUseCase;

describe('Register use case', () => { 
    beforeEach(() => {
        UsersRepository = new InMemoryUsersRepository();
        registerUseCase = new RegisterUseCase(UsersRepository);
    });

    it('should be able to register', async () => {
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john@example.com.br',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
    });

    it('should hash user password upon registration', async () => {
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john@example.com.br',
            password: '123456'
        });

        const isPasswordCOrrectlyHashed = await compare('123456', user.password);
        expect(isPasswordCOrrectlyHashed).toBe(true);
    });

    it('should not allow registration of users with the same email', async () => {
        const email = 'gui@gui.com';
        await registerUseCase.execute({
            name: 'Guilherme',
            email,
            password: '123456'
        });
        await expect(async () => {
            await registerUseCase.execute({
                name: 'Guilherme',
                email,
                password: '123456'
            });
        }
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
})
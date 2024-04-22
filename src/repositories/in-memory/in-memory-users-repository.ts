import { User, Prisma } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
    private users: User[] = [];

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email === email) || null;
    }

    async create(data: Prisma.UserCreateInput) {
        const _user = {
            id: 'asdasd',
            name: data.name,
            email: data.email,
            password: data.password,
            createdAt: new Date(),
        };

        this.users.push(_user);
        return _user;
    }
}
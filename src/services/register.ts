import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
};

interface RegisterUseCaseResponse {
    user: User;
}
export class RegisterUseCase {
    constructor(private userRepository: UsersRepository) {}

    async execute ({ 
        email, 
        name, 
        password 
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const existingUser = await this.userRepository.findByEmail(email);
    
        if (existingUser) throw new UserAlreadyExistsError();
        
        const passwordHash = await hash(password, 6);
       
        const user = await this.userRepository.create({
            name,
            email,
            password: passwordHash,
        });
        return {
            user,
        }
    }
}
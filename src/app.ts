import fastify from "fastify";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";
import { env } from "./env";
export const app = fastify();

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        reply.status(400).send({ message: 'Validation erro.', issues: error.format()});
        return;
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // TODO: Send error to monitoring service  
    }

    return reply.status(500).send({ message: 'Internal server error' });
});
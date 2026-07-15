import express, { type Express } from 'express';
import rootRouter from './routes/index.js';
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL, PORT } from "./secret.js";
import { errorMiddleware } from './middlewares/errors.js';


const app: Express = express();
app.use(express.json());

app.use('/api', rootRouter);

const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});

export const prismaClient = new PrismaClient({
  adapter,
  log: ['query'],
});

app.use(errorMiddleware);

app.listen(PORT, () => {console.log('Server is running!')});     
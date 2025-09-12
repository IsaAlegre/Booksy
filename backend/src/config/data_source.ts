import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME  as string,
    synchronize: true,
    logging: false,
    entities: [__dirname + "/../modules/**/*Entity.{ts,js}"],
});
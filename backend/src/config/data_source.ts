import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";

import { User } from "../modules/users/userEntity.js";
import { Book } from "../modules/books/bookEntity.js";
import { Review } from "../modules/reviews/reviewEntity.js";
import { Library } from "../modules/libraries/libraryEntity.js";
import { Suggestion } from "../modules/suggestions/suggestionEntity.js";

dotenv.config();

const commonOptions = {
  entities: [User, Book, Review, Library, Suggestion],
  migrations: ["dist/migrations/*.js"],
  synchronize: false,
  logging: false,
};

const options: DataSourceOptions = process.env.DATABASE_URL
  ? {
      // Configuración para Producción (Render)
      type: "postgres",
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      ...commonOptions,
    }
  : {
      // Configuración para Desarrollo Local
      type: "postgres",
      host: process.env.DB_HOST!, 
      port: Number(process.env.DB_PORT!),
      username: process.env.DB_USER!, 
      password: process.env.DB_PASS!, 
      database: process.env.DB_NAME!, 
      ssl: { rejectUnauthorized: false },
      ...commonOptions,
    };

export const AppDataSource = new DataSource(options);
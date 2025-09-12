import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { AppDataSource } from './config/data_source.js';
import routes from "./routes.js";
import { errorHandler } from './middleware/errorHandle.js';

const app = express();
app.use(express.json());
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected");
    app.use("/api", routes);
    app.use(errorHandler);
    app.listen(3000, () => {
      console.log("🚀 Server running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });

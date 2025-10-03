import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { AppDataSource } from "./config/data_source.js";
import routes from "./routes.js";
import { errorHandler } from "./middleware/errorHandle.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

async function startServer() {
  try {
    console.log("🔄 Initializing Data Source...");
    await AppDataSource.initialize();
    console.log("✅ Data Source has been initialized!");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error during Data Source initialization:");
    console.error("Error message:", (error as any)?.message || "Unknown error");
    console.error("Error stack:", (error as any)?.stack || "No stack trace");
    console.error("Full error object:", JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
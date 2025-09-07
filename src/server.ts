import app from "./app";
import { config } from "./config/server";
import logger from "./utils/logger";
import prisma from "./config/prisma";
import redisClient from "./config/redis";

// Gestion des exceptions non capturées
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Gestion des promesses non gérées
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

async function startServer() {
  try {
    // Connexion à la base de données
    await prisma.$connect();
    logger.info("Connected to PostgreSQL database");

    // Connexion à Redis
    await redisClient.connect();
    logger.info("Connected to Redis");

    // Démarrage du serveur HTTP
    const server = app.listen(config.PORT, () => {
      logger.info(
        `🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
      );
      logger.info(`📊 Health check: http://localhost:${config.PORT}/health`);
      if (config.SWAGGER_ENABLED) {
        logger.info(
          `📚 API Documentation: http://localhost:${config.PORT}/api-docs`
        );
      }
    });

    // Arrêt propre du serveur
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        logger.info("HTTP server closed");
        try {
          await prisma.$disconnect();
          logger.info("Database connection closed");
          await redisClient.disconnect();
          logger.info("Redis connection closed");
          logger.info("Graceful shutdown completed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during graceful shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

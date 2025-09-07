import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { config } from "./config/server";
import { requestLogger } from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { ResponseUtil } from "./utils/response";
import userRoutes from "./modules/user/router/user.router";
import authRoutes from "./modules/auth/router/auth.router";
import promotionRoutes from "./modules/promotion/router/promotion.router";
// import groupRoutes from "./modules/group/router";
// import projectRoutes from "./modules/project/router";
// import projectAssignmentRoutes from "./modules/projectAssignment/router";
// import competenceRoutes from "./modules/competence/router";
// import competenceOnProjectRoutes from "./modules/competenceOnProject/router";
// import evaluationCriteriaRoutes from "./modules/evaluationCriteria/router";
// import submissionRoutes from "./modules/submission/router";
// import resourceRoutes from "./modules/resource/router";
// import notificationRoutes from "./modules/notification/router";

const app = express();

// Sécurité
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Limitation du nombre de requêtes
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Logging
app.use(requestLogger);

// Health check
app.get("/health", (req, res) => {
  ResponseUtil.success(
    res,
    {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
    },
    "Server is healthy"
  );
});

// API routes
const apiRouter = express.Router();
apiRouter.use("/users", userRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/promotions", promotionRoutes);
// apiRouter.use("/groups", groupRoutes);
// apiRouter.use("/projects", projectRoutes);
// apiRouter.use("/project-assignments", projectAssignmentRoutes);
// apiRouter.use("/competences", competenceRoutes);
// apiRouter.use("/competence-on-projects", competenceOnProjectRoutes);
// apiRouter.use("/evaluation-criteria", evaluationCriteriaRoutes);
// apiRouter.use("/submissions", submissionRoutes);
// apiRouter.use("/resources", resourceRoutes);
// apiRouter.use("/notifications", notificationRoutes);

app.use(`/api/${config.API_VERSION}`, apiRouter);

// Swagger
if (config.SWAGGER_ENABLED) {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "PERN Stack API",
        version: "1.0.0",
        description: "A comprehensive PERN stack API with TypeScript",
        contact: {
          name: "API Support",
          email: "support@example.com",
        },
      },
      servers: [
        {
          url: `http://localhost:${config.PORT}/api/${config.API_VERSION}`,
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: [
      "./src/modules/*/router/*.ts",
      "./src/docs/user.yaml",
      "./src/docs/promotion.yaml",
      "./src/docs/group.yaml",
      "./src/docs/project.yaml",
      "./src/docs/competence.yaml",
      "./src/docs/competenceOnProject.yaml",
      "./src/docs/evaluationCriteria.yaml",
      "./src/docs/submission.yaml",
      "./src/docs/resource.yaml",
      "./src/docs/notification.yaml",
      // Ajoute ici tous les modules
    ],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// 404
app.use("*", (req, res) => {
  ResponseUtil.notFound(
    res,
    `Route ${req.method} ${req.originalUrl} not found`
  );
});

// Gestion globale des erreurs
app.use(errorHandler);

export default app;

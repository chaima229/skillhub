import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SkillHub API",
      version: "1.0.0",
      description: "Documentation de l'API SkillHub",
    },
  },
  apis: [
    "./src/modules/user/router/user.router.ts",
    "./src/docs/user.yaml",
    "./src/docs/promotion.yaml",
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

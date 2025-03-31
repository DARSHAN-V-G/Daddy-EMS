import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";
const PORT: string = process.env.PORT || "3000";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Daddy-EMS API",
            version: "1.0.0",
            description: "API documentation for Daddy-EMS",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Local server",
            },
        ],
    },
    apis: ["./src/api/auth/userAuth/*.ts"], // Update this if you have more routes
};

const swaggerSpec = swaggerJsDoc(options);

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

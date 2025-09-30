import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "KPIs Management API",
    version: "1.0.0",
    description: "API documentation for KPIs Management System",
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // ✅ ให้มันไปอ่าน JSDoc comment
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

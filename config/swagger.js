const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Guard",
      version: "1.0.0",
      description: "Food Guard - API specification",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

try {
  const outputPath = path.join(__dirname, "../docs/Swagger/swagger-spec.json");
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), "utf8");
  console.log("✅ Swagger JSON file has been generated successfully.");
} catch (err) {
  console.error("❌ Failed to save Swagger JSON:", err);
}

module.exports = {
  swaggerUi,
  specs,
};

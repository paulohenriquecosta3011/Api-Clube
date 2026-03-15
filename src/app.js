// src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { swaggerDocs } from "./config/swagger.js"; // nome correto do arquivo

const app = express();

app.use(cors());
app.use(express.json());

// Integra o Swagger antes das rotas
swaggerDocs(app);

// Prefixo /api para todas as rotas
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
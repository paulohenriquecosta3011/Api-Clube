// src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { swaggerDocs } from "./config/swagger.js"; // nome correto do arquivo
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "src", "uploads"))
  );

// Integra o Swagger antes das rotas
swaggerDocs(app);

// Prefixo /api para todas as rotas
//app.use('/api', routes);
app.use('/api/v1', routes);
// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
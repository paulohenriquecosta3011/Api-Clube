import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Prefixo /api para todas as rotas
app.use('/api', routes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Rota não encontrada",
    path: req.originalUrl,
    method: req.method
  });
});

app.use(errorHandler);

export default app;

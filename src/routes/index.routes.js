//index.routes.js do do routes
import { Router } from "express";
import usersRoutes from "./users.routes.js"; // importa o arquivo que criamos
import convidadosRoutes from "./convidados.routes.js"

const router = Router();

// Define que todas as rotas do users.routes.js vão responder a partir de /users
router.use("/users", usersRoutes);
router.use("/convidados", convidadosRoutes)

export default router;

//index.routes.js do do routes
import { Router } from "express";
import usersRoutes from "./users.routes.js"; 
import convidadosRoutes from "./convidados.routes.js"
import convitesRoutes from "./convite.routes.js";
import maquinasRoutes from "./maquinas.routes.js"; 

const router = Router();

// Define que todas as rotas do users.routes.js vão responder a partir de /users
router.use("/users", usersRoutes);
router.use("/convidados", convidadosRoutes)
router.use("/convites", convitesRoutes);
router.use("/maquinas", maquinasRoutes);  

export default router;

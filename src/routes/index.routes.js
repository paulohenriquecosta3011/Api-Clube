//index.routes.js do do routes
import { Router } from "express";
import usersRoutes from "./users.routes.js"; 
import convidadosRoutes from "./convidados.routes.js"
import convitesRoutes from "./convite.routes.js";
import maquinasRoutes from "./maquinas.routes.js"; 

const router = Router();


router.use("/users", usersRoutes);
router.use("/guests", convidadosRoutes);
router.use("/invitations", convitesRoutes);
router.use("/machines", maquinasRoutes);



export default router;

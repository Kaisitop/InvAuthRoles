import { Router } from "express";
import { createUser } from "../controllers/Usuario.controller.js";
import { authJwt, verifySignup } from "../middlewares/index.js";

const router = Router()

router.post('/',[authJwt.verifyToken, authJwt.isAdmin, verifySignup.checkRolesExisted],createUser)

export default router
import { Router } from "express";

const router = Router()

import * as authCtrl from '../controllers/Auth.controller.js'
import { authJwt, verifySignup } from "../middlewares/index.js";
import {validateSchema} from '../middlewares/validator.middleware.js'
import { registerSchema, loginSchema} from '../schemas/auth.schema.js'

router.post('/register',[verifySignup.checkDuplicateUsernameOrEmail, verifySignup.checkRolesExisted],validateSchema(registerSchema), authCtrl.register)
router.post('/login',validateSchema(loginSchema), authCtrl.login)
router.post('/logout', authCtrl.logout)
router.get('/profile',authJwt.verifyToken, authCtrl.profile)

export default router
import express from 'express'
import { getClientes, createCliente, buscarCliente, actualizarCliente, eliminarCliente, eliminarList } from '../controllers/Cliente.Controller.js'
import { authJwt, verifySignup } from "../middlewares/index.js";
import { validateSchema } from '../middlewares/validator.middleware.js';
import { clienteSchema } from '../schemas/cliente.schema.js';

const router = express.Router()

router.get('/',authJwt.verifyToken, getClientes)
router.post('/',authJwt.verifyToken,validateSchema(clienteSchema),createCliente)
router.get('/:id',authJwt.verifyToken, buscarCliente)
router.put('/:id',authJwt.verifyToken, actualizarCliente)
router.delete('/:id',authJwt.verifyToken, eliminarCliente)
router.delete('/',authJwt.verifyToken, eliminarList)
export default router

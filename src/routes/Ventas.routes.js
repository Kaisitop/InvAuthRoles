import express from 'express'
import { buscarVenta, crearVenta, obtenerVentas, actualizarVenta, eliminarVenta, eliminarVentaLista } from '../controllers/Ventas.Controller.js'
import {authJwt} from '../middlewares/index.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import ventasSchema from '../schemas/ventas.schema.js'

const router = express.Router();

router.get('/',authJwt.verifyToken, obtenerVentas)
router.post('/',authJwt.verifyToken,validateSchema(ventasSchema), crearVenta)
router.get('/:id',authJwt.verifyToken, buscarVenta)
router.put('/:id',authJwt.verifyToken, actualizarVenta)
router.delete('/:id',authJwt.verifyToken, eliminarVenta)
router.delete('/',authJwt.verifyToken, eliminarVentaLista)

export default router
import express from 'express'
import { GetProductos, crearProducto, buscarProd, actualizarProd, eliminarProd, eliminarListaProd} from '../controllers/Producto.Controller.js'

import {authJwt} from '../middlewares/index.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import productoSchema from '../schemas/producto.schema.js'


const router = express.Router();

router.get('/',authJwt.verifyToken,GetProductos)
router.post('/',authJwt.verifyToken,validateSchema(productoSchema),crearProducto)
router.get('/:id',authJwt.verifyToken, buscarProd)
router.put('/:id',authJwt.verifyToken, actualizarProd)
router.delete('/:id',authJwt.verifyToken,eliminarProd)
router.delete('/',authJwt.verifyToken, eliminarListaProd)
export default router;
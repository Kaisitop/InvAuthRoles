import express from 'express'
import { GetProductos, crearProducto, buscarProd, actualizarProd, eliminarProd, eliminarListaProd} from '../controllers/Producto.Controller.js'

const router = express.Router();

router.get('/',GetProductos)
router.post('/',crearProducto)
router.get('/:id', buscarProd)
router.put('/:id', actualizarProd)
router.delete('/:id', eliminarProd)
router.delete('/', eliminarListaProd)
export default router;
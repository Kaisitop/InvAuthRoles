import express from 'express'
import { buscarVenta, crearVenta, obtenerVentas, actualizarVenta, eliminarVenta, eliminarVentaLista } from '../controllers/Ventas.Controller.js'

const router = express.Router();

router.get('/', obtenerVentas)
router.post('/', crearVenta)
router.get('/:id', buscarVenta)
router.put('/:id', actualizarVenta)
router.delete('/:id', eliminarVenta)
router.delete('/', eliminarVentaLista)

export default router
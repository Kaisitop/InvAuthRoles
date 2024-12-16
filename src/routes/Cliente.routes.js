import express from 'express'
import { getUsers, createUser, buscarUser, actualizarUser,eliminarUser,eliminarList} from '../controllers/Cliente.Controller.js'

const router = express.Router();

router.get('/', getUsers)
router.post('/', createUser)
router.get('/:id', buscarUser)
router.put('/:id', actualizarUser)
router.delete('/:id', eliminarUser)
router.delete('/', eliminarList)
export default router;

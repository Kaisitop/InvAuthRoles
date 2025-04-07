import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import morgan from 'morgan'
import rutasClientes from './routes/Cliente.routes.js'
import rutasProductos from './routes/Productos.routes.js'
import rutasVentas from './routes/Ventas.routes.js'
import rutasAuth from './routes/Auth.routes.js'
import rutasUsuarios from './routes/Usuarios.routes.js'
import { createRoles } from './libs/initialSetup.js'
import cookieParser from 'cookie-parser'


dotenv.config();

const app = express()
createRoles()

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(morgan('dev'))
app.get('/', (req, res)=> res.send('hola'))
app.use(cors())
app.use(express.json())
app.use(cookieParser())

//rutas
app.use('/api/clientes', rutasClientes)
app.use('/api/productos', rutasProductos)
app.use('/api/ventas', rutasVentas)
app.use('/api/auth', rutasAuth)
app.use('/api/usuarios',rutasUsuarios)

connectDB()

const PORT = process.env.PORT || 5100

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
  
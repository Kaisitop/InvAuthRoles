import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js';
import morgan from 'morgan';
import rutasClientes from './routes/Cliente.routes.js'
import rutasProductos from './routes/Productos.routes.js'
import rutasVentas from './routes/Ventas.routes.js'

dotenv.config();

const app = express()
app.use(morgan('dev'))
app.get('/', (req,res)=> res.send("hola"))
app.use(cors());
app.use(express.json());

//rutas
app.use('/api/users', rutasClientes)
app.use('/api/productos',rutasProductos)
app.use('/api/ventas', rutasVentas)


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servido corriendo en http://localhost:${PORT}`) );

import mongoose from "mongoose";
import { validarPrec } from "../utils/validarPrecio.js";

const productoSchema = new mongoose.Schema(
    {
        producto:{type: String, required: true, trim: true},
        descripcion:{type: String, required: true, trim: true},
        precio:{
            type: Number, 
            required: true, 
            min: 0,
            validate:{
                validator: validarPrec,
                message: 'El precio no puede exceder los 10.000'
            }
        },
        stock:{
            type: Number, 
            required: true, 
            min: 0
        },
        activo:{
            type: Boolean,
            default: true,
        }
        
    },
    { timestamps: true }
)

const Producto = mongoose.model('Producto', productoSchema)
export default Producto;
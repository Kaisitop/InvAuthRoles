import mongoose from "mongoose";
import Usuario from "./Usuarios.js";

const productoSchema = new mongoose.Schema(
    {
        producto: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        precio: {
            type: Number,
            required: true,
            min: 0,
        
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },
        activo: {
            type: Boolean,
            default: true,
        }

    },
    { timestamps: true }
)

const Producto = mongoose.model('Producto', productoSchema)
export default Producto;
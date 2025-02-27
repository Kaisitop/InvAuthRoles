import mongoose from "mongoose";
import { esValido } from "../utils/validar.js";
import Usuario from "./Usuarios.js";

const clienteSchema = new mongoose.Schema(
  {
    nombres: { type: String, required: true },
    email: { type: String, unique: true },
    identificacion: {
      type: String,
      unique: true,
    },
    celular: {
      type: String,
      required: true,
      unique: true,
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    },
    activo:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;

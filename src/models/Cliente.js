import mongoose from "mongoose";
import { esValido } from "../utils/validar.js";

const userSchema = new mongoose.Schema(
  {
    nombres: { type: String, required: true },
    email: { type: String, unique: true },
    identificacion: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: esValido,
        message: "La cédula debe contener exactamente 10 dígitos",
      },
    },
    celular: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: esValido,
        message: "El número de celular debe contener exactamente 10 dígitos",
      },
    },
    activo:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

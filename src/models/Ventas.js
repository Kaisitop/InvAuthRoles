import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.ObjectId,
      ref: "Cliente",
      required: false,
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Venta = mongoose.model("Venta", ventaSchema);
export default Venta;

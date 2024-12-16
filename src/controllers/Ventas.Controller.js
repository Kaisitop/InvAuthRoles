import Venta from "../models/Ventas.js";
import User from "../models/Cliente.js";
import Product from "../models/producto.js";

export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate("cliente", "nombres identificacion")
      .populate("productos.producto", "producto precio");

    res.status(200).json({
      message: "ventas obtenidas exitosamente",
      ventas,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al obtener las ventas",
      error: err.message,
    });
  }
};

export const crearVenta = async (req, res) => {
  const { cliente, productos } = req.body;

  // validamos que exista
  if (!productos) {
    return res.status(400).json({
      message: "el campo 'productos' es obligatorio",
    });
  }

  try {
    let clienteExistente = null;

    //validar que el cliente existe
    if(cliente){
      clienteExistente = await User.findOne({_id: cliente});

      if(!clienteExistente){
        return res.status(400).json({
          message: 'Datos Incorrectos'
        })
      }
    } else{
      clienteExistente = { _id: null}
    }
 

    //obtener todos los productos en una sola consulta
    const productoIds = productos.map((item) => item.producto); //crea un array de los ids de los productos apartir del array productos

    const productosDB = await Product.find({ _id: { $in: productoIds } }); //Este array incluye objetos de productos que tienen atributos como _id, nombre, stock, precio

    //verificar la existencia y stock de los productos
    let totalCalculado = 0;
    for (const item of productos) {
      const productoBusID = productosDB.find(
        (p) => p._id.toString() === item.producto
      );
      if (!productoBusID) {
        return res.status(404).json({
          message: `El producto con ID ${item.producto} no existe`,
        });
      }

      if (productoBusID.stock < item.cantidad) {
        return res.status(400).json({
          message: `NO hay suficiente stock para el producto ${productoBusID.producto}`,
        });
      }
      totalCalculado += productoBusID.precio * item.cantidad;
    }

    const totalRedondeado = Math.round(totalCalculado * 100) / 100;

    //reducir el stock de los productos
    const operacionesStock = productos.map((item) => ({
      updateOne: {
        filter: { _id: item.producto },
        update: { $inc: { stock: -item.cantidad } },
      },
    }));
    await Product.bulkWrite(operacionesStock); //actualiza el stock de los productos

    //crear la venta
    const nuevaVenta = await Venta.create({
      cliente: clienteExistente._id ,
      productos,
      total: totalRedondeado,
    });
    res.status(201).json({
      message: "La venta fue creada exitosamente",
      venta: nuevaVenta,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al crear la venta",
      error: err.message,
    });
  }
};

export const buscarVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const ventaId = await Venta.findById(id)
      .populate("cliente", "nombres identificacion")
      .populate("productos.producto", "producto descripcion precio");
    if (!ventaId) {
      return res.status(400).json({
        message: `la venta con Id:${id} no existe`,
      });
    }
    res.status(200).json({
      message: "Venta encontrada con éxito.",
      ventaId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al buscar la venta",
      error: err.message,
    });
  }
};

export const actualizarVenta = async (req, res) => {
  const { id } = req.params;
  const { cliente, productos } = req.body;
  if (!cliente && !productos) {
    return res.status(400).json({
      message: "se debe proporcionar al menos un campo para actualizar",
    });
  }
  try {
    const ventaId = await Venta.findById(id);
    if (!ventaId) {
      return res.status(404).json({
        message: "venta no encontrada",
      });
    }

    if(cliente){

    }
    if (cliente) ventaId.cliente = cliente;

    if(productos){
      const productoIds = productos.map((item) => item.producto);
    const productosDB = await Product.find({ _id: { $in: productoIds } });

    let totalCalculado = 0;
    for( const item of productos){
      const productoBusID = productosDB.find(
        (p) => p._id.toString() === item.producto
      );

      if (!productoBusID) {
       return res.status(404).json({
          message: `El producto con ID ${item.producto} no existe`,
        });
      }

      if (productoBusID.stock < item.cantidad) {
       return res.status(400).json({
          message: `NO hay suficiente stock para el producto ${productoBusID.producto}`,
        });
      }

      totalCalculado += productoBusID.precio * item.cantidad;
    };

    //reducir el stock de los productos
    const operacionesStock = productos.map((item) => ({
      updateOne: {
        filter: { _id: item.producto },
        update: { $inc: { stock: -item.cantidad } },
      },
    }));

    await Product.bulkWrite(operacionesStock); //actualiza el stock de los product

    if (productos) ventaId.productos = productos;
    }

    await ventaId.save();

    res.status(200).json({
      message: "su venta fue actualizada",
      ventaId,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al actualizar la venta",
      error: err.message,
    });
  }
};

export const eliminarVenta = async (req, res) => {
  const {id} = req.params;
  try {
    const delVenta = await Venta.findByIdAndDelete(id)

    if(!delVenta){
      return res.status (404).json({
        message: 'Venta no encontrada'
      })
    }

    res.status(201).json({
      message: 'Venta eliminada con exito',
      delVenta
    })
  } catch (err) {
    res.status(500).json({
      message:'error al eliminar la venta',
      error: err.message
    })
  }
}

export const eliminarVentaLista = async (req,res) => {

  try {
    const listaVenta = await Venta.deleteMany();
    if(!listaVenta){
      return res.status(404).json({
        message: 'No hay ventas para eliminar'
      })
    }

    res.status(200).json({
      message: 'Las ventas han sido eliminadas'
    })
  } catch (err) {
    res.status(500).json({
      message:'error al eliminar ventas',
      error: err.message
    })
  }
}
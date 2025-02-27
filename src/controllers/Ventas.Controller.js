import Venta from "../models/Ventas.js";
import Cliente from "../models/Cliente.js";
import Product from "../models/producto.js";

export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({activo: true})
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
      clienteExistente = await Cliente.findOne({_id: cliente, activo: true});

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

    const productosDB = await Product.find({ _id: { $in: productoIds }, activo: true }); //Este array incluye objetos de productos que tienen atributos como _id, nombre, stock, precio

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
      activo: true
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
    res.status(200).json(ventaId.activo ? ventaId :{
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
      message: "Se debe proporcionar al menos un campo para actualizar",
    });
  }
  try {
    const ventaId = await Venta.findById(id);
    if (!ventaId || !ventaId.activo) {
      return res.status(404).json({
        message: "Venta no encontrada",
      });
    }

    if (cliente) ventaId.cliente = cliente;

    if (productos) {
      const productoIds = productos.map((item) => item.producto);
      const productosDB = await Product.find({ _id: { $in: productoIds } });

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
            message: `No hay suficiente stock para el producto ${productoBusID.producto}`,
          });
        }

        totalCalculado += productoBusID.precio * item.cantidad;
      }

      // Reducir el stock de los productos
      const operacionesStock = productos.map((item) => ({
        updateOne: {
          filter: { _id: item.producto },
          update: { $inc: { stock: -item.cantidad } },
        },
      }));

      await Product.bulkWrite(operacionesStock); // Actualiza el stock de los productos

      ventaId.productos = productos;
      ventaId.total = totalCalculado; // Actualiza el total de la venta
    }

    await ventaId.save();

    res.status(200).json({
      message: "Su venta fue actualizada",
      ventaId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al actualizar la venta",
      error: err.message,
    });
  }
};

export const eliminarVenta = async (req, res) => {
  const {id} = req.params;
  try {
    const delVenta = await Venta.findById(id)

    if(!delVenta || !delVenta.activo){
      return res.status (404).json({
        message: 'Venta no encontrada'
      })
    }

    delVenta.activo = false;
    await delVenta.save();

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
    const listaVenta = await Venta.updateMany({activo: true}, {$set: {activo: false}});
    if(listaVenta.nModified === 0){
      return res.status(404).json({
        message: 'No hay ventas para eliminar'
      })
    }

    res.status(200).json({
      message: 'Las ventas han sido eliminadas',
      modifiedCount: listaVenta.nModified,    
    })
  } catch (err) {
    res.status(500).json({
      message:'error al eliminar ventas',
      error: err.message
    })
  }
}
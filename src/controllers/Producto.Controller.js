import Product from "../models/producto.js";

export const GetProductos = async (req, res) => {
  try {
    const produc = await Product.find({activo: true});
    res.status(200).json(produc);
  } catch (err) {
    res.status(500).json({
      Message: "no se encontraron productos",
      error: err.Message,
    });
  }
};

export const crearProducto = async (req, res) => {
  const { producto, descripcion, precio, stock } = req.body;

  if (!producto || !descripcion || !precio || !stock) {
    return res.status(400).json({
      Message: "los campos son obligatorios",
    });
  }
  try {
    const productoExistente = await Product.findOne({ producto });
    if (productoExistente) {
      if(productoExistente.activo){
        return res.status(400).json({
          message: "el producto ya existe",
        });
      }else{
        //reactivar producto
        productoExistente.descripcion = descripcion;
        productoExistente.precio = precio;
        productoExistente.stock = stock;
        productoExistente.activo = true;
        await productoExistente.save();

        return res.status(200).json({
          message: "producto reactivado correctamente",
          producto: productoExistente,
        });
      }
      
    }

    const newProducto = await Product.create({
      producto,
      descripcion,
      precio,
      stock,
    });
    res.status(201).json({
      message: "el producto fue creado exitosamente",
      newProducto,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al crear el producto",
      error: err.message,
    });
  }
};

export const buscarProd = async (req, res) => {
  const { id } = req.params;

  try {
    const productoID = await Product.findById(id);
    if (!productoID) {
      return res.status(404).json({
        message: "El producto no existe",
      });
    }
    //responder exitosamente
    res.status(200).json(productoID.activo ? productoID:{
      message: "producto encontrado",
      productoID,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al encontrar el producto",
      error: err.message,
    });
  }
};

export const actualizarProd = async (req, res) => {
  const { id } = req.params;
  const { producto, descripcion, precio, stock } = req.body;

  if (!producto && !descripcion && !precio && !stock) {
    return res.status(400).json({
      message: "se debe proporcionar al menos un campo para actualizar",
    });
  }

  try {
    const product = await Product.findById(id);

    if (!product || !product.activo) {
      return res.status(404).json({
        message: "El producto no fue encontrado",
      });
    }

    //datos a actualizar
    if (producto) product.producto = producto;
    if (descripcion) product.descripcion = descripcion;
    if (precio) product.precio = precio;
    if (stock) product.stock = stock;

    await product.save();

    res.status(200).json({
      message: "producto actualizado correctamente",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al actualizar el producto",
      error: err.message,
    });
  }
};

export const eliminarProd = async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await Product.findById(id);
    if (!prod || !prod.activo) {
      return res.status(400).json({
        message: "producto no encontrado",
      });
    }

    //responder con exito
    prod.activo = false;
    await prod.save();
 
    res.status(200).json({
      message: "producto eliminado correctamente",
    });
  } catch (err) {
    res.status(500).json({
      message: "error al eliminar el producto",
      error: err.message,
    });
  }
};

export const eliminarListaProd = async (req, res) => {
  try {
    const listaProd = await Product.updateMany({activo: true},{$set: {activo: false}}); 
    if (listaProd.nModified === 0) {
      return (
        res.status(400),
        json({
          message: "no hay productos en la lista",
        })
      );
    }

    //RESPOnder con exito
    res.status(200).json({
        message:'La lista de productos se ha eliminado',
        modifiedCount: listaProd.nModified,
    })
  } catch (err) {
    res.status(500).json({
        message:'error al eliminar la lista',
        error:err.message
    })
  }
};

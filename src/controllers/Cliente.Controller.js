import Cliente from "../models/Cliente.js";

export const getClientes = async (req, res) => {
  try {
    const users = await Cliente.find({ user: req.user.id, activo: true }).populate("user", "username");
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "error al obtener usuarios", error: err.message });
  }
};

export const createCliente = async (req, res) => {
  const { nombres, email, identificacion, celular } = req.body;

  //vaidar los datos recibidos
  if (!nombres || !email || !identificacion || !celular) {  
    return res
      .status(400)
      .json({ message: "Nombre y correo son obligatorios" });
  }

  try {
    const usuarioExistente = await Cliente.findOne({ identificacion });
    if (usuarioExistente) {
      if(usuarioExistente.activo){
        return res.status(400).json({ message: "El usuario ya existe" });
      }else{
        //reactivar usuario
        usuarioExistente.nombres = nombres;
        usuarioExistente.email = email;
        usuarioExistente.celular = celular;
        usuarioExistente.user = req.user.id;
        usuarioExistente.activo = true;
        await usuarioExistente.save();

        return res.status(200).json({
          message: "usuario reactivado correctamente",
          user: usuarioExistente,
        })
      }
     
    }

    //CREAR USUARIO
    const newCliente = await Cliente.create({ nombres, email, identificacion, celular, user: req.user.id, activo: true });

    //RESPONDER CON EL USUARIO CREADO
    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: newCliente,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al crear usuario",
      error: err.message,
    });
  }
};

export const buscarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioId = await Cliente.findById(id);
    if (!usuarioId) {
      return res
        .status(404)
        .json({ message: `El usuario con Id: ${id} no existe` });
    }
    res.status(200).json(usuarioId.activo ? usuarioId : { message: "usuario inactivo" });
  } catch (err) {
    res.status(500).json({
      message: "error al buscar al usuario",
      error: err.message,
    });
  }
};

export const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombres, email, identificacion, celular } = req.body;

  if (!nombres && !email && !identificacion && !celular) {
    return res.status(400).json({
      message: "Se debe proporcionar al menos un campo para actualizar",
    });
  }

  try {
    // Buscar el usuario por id
    const user = await Cliente.findById(id);

    // Si no existe o está inactivo, mandar error
    if (!user || !user.activo) {
      return res.status(404).json({ message: "Usuario no encontrado o inactivo" });
    }

    // Actualizar los campos
    if (nombres) user.nombres = nombres;
    if (email) user.email = email;
    if (identificacion) user.identificacion = identificacion;
    if (celular) user.celular = celular;

    // Guardar los datos actualizados
    await user.save();

    // Usuario encontrado y actualizado
    res.status(200).json({
      message: "Usuario actualizado correctamente",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: err.message,
    });
  }
};

export const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Cliente.findById(id);
    if (!user || !user.activo) {
      return res.status(404).json({
        message: "usuario no encontrado",
      });
    }

    //desactivamos el usuario
    user.activo = false;
    await user.save();

    //responder con exito
    res.status(200).json({
      message: "usuario eliminado exitosamente",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al eliminar el usuario",
      error: err.message,
    });
  }
};

export const eliminarList = async (req, res) => {
  try {
    const result = await Cliente.updateMany({activo: true}, {$set: {activo: false}});
    if (result.nModified === 0) {
      return res.status(404).json({ message: "no hay usuarios para eliminar" });
    }

    //responder con exito
    res.status(200).json({
      message: "Los Usuarios han sido eliminados",
      modifiedCount: result.nModified,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al eliminar los usuarios",
      error: err.message,
    });
  }
};

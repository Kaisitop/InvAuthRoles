import User from "../models/Cliente.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "error al obtener usuarios", error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { nombres, email, identificacion, celular } = req.body;

  //vaidar los datos recibidos
  if (!nombres || !email || !identificacion || !celular) {
    return res
      .status(400)
      .json({ message: "Nombre y correo son obligatorios" });
  }

  try {
    const usuarioExistente = await User.findOne({ identificacion });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    //CREAR USUARIO
    const newUser = await User.create({ nombres, email, identificacion, celular });

    //RESPONDER CON EL USUARIO CREADO
    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al crear usuario",
      error: err.message,
    });
  }
};

export const buscarUser = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioId = await User.findById(id);
    if (!usuarioId) {
      return res
        .status(404)
        .json({ message: `El usuario con Id: ${id} no existe` });
    }
    res.status(200).json(usuarioId);
  } catch (err) {
    res.status(500).json({
      message: "error al buscar al usuario",
      error: err.message,
    });
  }
};

export const actualizarUser = async (req, res) => {
  const { id } = req.params;
  const { nombres, email, identificacion, celular } = req.body;

  if (!nombres && !email && !identificacion && celular) {
    return res.status(400).json({
      message: `se debe proporcionar al menos un campo para actualizar`,
    });
  }

  try {
    //buscar el usuario por id
    const user = await User.findById(id);

    //si no existe madar error
    if (!user) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }

    //actualizar los campos
    if (nombres) user.nombres = nombres;
    if (email) user.email = email;
    if (identificacion) user.identificacion = identificacion;
    if (celular) user.celular = celular;
    //guardamos los datos actualizados
    await user.save();

    //usuario encontrado
    res.status(200).json({
      message: "usuario actualizado correctamente",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "error al actualizar el usuario",
      error: err.message,
    });
  }
};

export const eliminarUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "usuario no encontrado",
      });
    }
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
    const lista = await User.deleteMany();
    if (!lista) {
      return res.status(404).json({ message: "no hay usuarios para eliminar" });
    }
    //responder con exito
    res.status(200).json({
      message: "Los Usuarios han sido eliminados",
    });
  } catch (err) {
    res.status(500).json({
      message: "error al eliminar los usuarios",
      error: err.message,
    });
  }
};

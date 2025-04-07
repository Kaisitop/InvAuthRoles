import Usuario from "../models/Usuarios.js";
import Role from "../models/Role.js";
import { createAccessToken } from "../libs/jwt.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;

        const userFound = await Usuario.findOne({email})
        if(userFound)
            return res.status(400).json(['El email ya esta en uso'])
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new Usuario({
            username,
            email,
            password: passwordHash,
        })

        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } })
            newUser.roles = foundRoles.map(role => role._id)
        } else {
            const role = await Role.findOne({ name: "usuario" })
            newUser.roles = [role._id]
        }

        const userSaved = await newUser.save()

        const nameRoles = await Usuario.findById(userSaved._id).populate("roles", "name")
        const token = await createAccessToken({ id: nameRoles._id })
        res.cookie("token", token)
        res.json({
            id: nameRoles._id,
            email: nameRoles.email,
            roles: nameRoles.roles.map(role => role.name)
        })
    } catch (error) {
        res.status(500).json({
            message: error.message

        })
    }



}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userFound = await Usuario.findOne({ email })
        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" })

        const isMatch = await bcrypt.compare(password, userFound.password)
        if(!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" })

        const nameRoles = await Usuario.findById(userFound._id).populate("roles", "name")
        const token = await createAccessToken({ id: nameRoles._id })
        res.cookie("token", token)
        res.json({
            id: nameRoles._id,
            email: nameRoles.email,
            roles: nameRoles.roles.map(role => role.name)
        })
    } catch (error) {
        res.status(500).json({
            message: error.message

        })
    }



}

export const logout = async (req, res) => {
    res.cookie("token", "", {expires: new Date(0)})
    return res.sendStatus(200);
}

export const profile = async(req,res)=> {
    const userFound = await Usuario.findById(req.user.id)

    if (!userFound) return res.status(400).json({message: "usuario no encontrado"})
    
    const usuarioRol = await Usuario.findById(userFound._id).populate("roles", "name")

    return res.json({
        id: userFound.id,
        username: userFound.username,
        email: userFound.email,
        roles: usuarioRol.roles.map(role=> role.name)

    })
}
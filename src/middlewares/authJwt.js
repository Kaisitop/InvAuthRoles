import jwt from 'jsonwebtoken'
import TOKEN_SECRET from '../config/config.js'
import Usuario from '../models/Usuarios.js'
import Role from '../models/Role.js'

// export const verifyToken = async (req, res, next) => {
//     try {
//         const {token} = req.cookies


//         if (!token) return res.status(401).json({ message: "No token, Autorizacion denegada" })

//         jwt.verify(token, TOKEN_SECRET, (err, user) =>{
//             if(err) return res.status(403).json({message: "token no valido"})
//                 req.user = user
//         })

//         next()
//     } catch (error) {
//         return res.status(401).json({ message: 'No autorizado' })
//     }
// }

export const verifyToken = (req, res, next) => {

    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: "No token, Autorizacion denegada" })

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "token no valido" })
        req.user = user
        next()
    })

    
}

export const isModerator = async (req, res, next) => {
    const user = await Usuario.findById(req.userId)
    const roles = await Role.find({ _id: { $in: user.roles } })

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderador") {
            next()
            return;
        }

    }
    return res.status(403).json({ message: "requiere rol de moderador" })
}

export const isAdmin = async (req, res, next) => {
    const user = await Usuario.findById(req.userId)
    const roles = await Role.find({ _id: { $in: user.roles } })

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
            next()
            return;
        }

    }
    return res.status(403).json({ message: "requiere rol de admin" })
}
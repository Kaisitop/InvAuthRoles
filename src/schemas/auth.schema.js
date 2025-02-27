import {z} from 'zod'

export const registerSchema = z.object({
    username: z.string({
        required_error: 'El username es requerido'
    }),
    email: z.string({
        required_error:'El email es requerido'
    }).email({
        message: 'email invalido'
    }),
    password: z.string({
        required_error: 'la contraseña es requerida'
    }).min(6,{
        message: 'La contraseña debe tener mas de 6 caracteres'
    })
})

export const loginSchema = z.object({
    email: z.string({
        required_error: 'El email es requerido'
    }).email({
        message: 'Email invalido'
    }),
    password: z.string({
        required_error: 'la contraseña es requerida'
    }).min(6,{
        message: 'La contraseña debe tener mas de 6 caracteres'
    })
})
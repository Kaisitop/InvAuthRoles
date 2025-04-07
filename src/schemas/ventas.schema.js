import {z} from 'zod'

const ventasSchema = z.object({
    cliente: z.string().optional(),
    productos: z.array(z.object({
        producto: z.string().min(1, 'El id del producto es requerido'),
        cantidad: z.number().min(1, 'la cantidad debe ser al menos 1')
    }))
})

export default ventasSchema 
import { z } from 'zod'

const productoSchema = z.object({
    producto: z.string({
        required_error: 'Producto es requerido'
    }),
    descripcion: z.string({
        required_error: 'la descripcion deben ser strings'
    }).optional(),
    precio: z.number({
        required_error: 'precio es requerido'
    }).max(10000, 'el precio no debe exceder los 10.000').min(0, 'el precio no puede ser negativo'),
    stock: z.number({
        required_error: 'stock es requerido'
    }).min(0, 'el stock no puede ser negativo')
})

export default productoSchema
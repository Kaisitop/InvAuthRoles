import { z } from 'zod';

export const clienteSchema = z.object({
    nombres: z.string({
        required_error: 'Se requiere nombres'
    }).trim(),

    email: z.string({
        required_error: 'Se requiere un email'
    }).email('Email inválido').optional(),

    identificacion: z.string({
        required_error: 'Identificación requerida'
    }).length(10, 'Su identificación debe contener exactamente 10 dígitos'),


    celular: z.string({
        required_error: 'Su número de celular es requerido'
    }).length(10, 'Su número de celular debe contener exactamente 10 dígitos'),
});

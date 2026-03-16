import { z } from 'zod'

// Validadores para registro y login usando la API de mensajes de Zod
export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: 'El nombre es obligatorio' })
      .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
      .max(100, { message: 'El nombre no puede exceder 100 caracteres' }),

    email: z
      .string()
      .nonempty({ message: 'El email es obligatorio' })
      .refine((val) => z.regexes.html5Email.test(val), { message: 'Formato de email no válido' }),

    password: z
      .string()
      .nonempty({ message: 'La contraseña es obligatoria' })
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
      .max(128, { message: 'La contraseña no puede exceder 128 caracteres' }),
  })
  // El rol siempre es 'cliente' en el registro público, sin importar lo que envíe el cliente
  .transform((data) => ({ ...data, role: 'cliente' as const }))

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'El email es obligatorio' })
    .refine((val) => z.regexes.html5Email.test(val), { message: 'Formato de email no válido' }),

  password: z
    .string()
    .nonempty({ message: 'La contraseña es obligatoria' })
    .min(1, { message: 'La contraseña es obligatoria' }),
})

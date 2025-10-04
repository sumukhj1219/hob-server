import z from "zod";

export const addAddressSchema = z.object({
    house: z.string(),
    street: z.string(),
    area: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postal: z.string()
})

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  address: z
    .object({
      house: z.string().optional(),
      street: z.string().optional(),
      area: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postal: z.string().optional(),
    })
    .optional(),
  phone: z.string().optional(),
});
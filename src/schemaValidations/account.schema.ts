import { RoleValues } from '@/constants/type'
import z from 'zod'



export const AccountRes = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum(RoleValues)
})

export type AccountResType = z.infer<typeof AccountRes>



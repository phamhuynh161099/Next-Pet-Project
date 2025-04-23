import { RoleValues } from '@/constants/type'
import z from 'zod'



export const AccountRes = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum(RoleValues),
    avatar: z.string(),
})

export type AccountResType = z.infer<typeof AccountRes>


export const UpdateMeBody = z.object({
    name: z.string(),
    avatar: z.string(),
})

export type UpdateMeBodyType = z.infer<typeof UpdateMeBody>
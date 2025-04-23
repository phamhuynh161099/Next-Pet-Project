import { RoleValues } from '@/constants/type'
import z from 'zod'

export const LoginBody = z
    .object({
        email: z.string().email(),
        password: z.string().min(6).max(100),
    })
    .strict()

export type LoginBodyType = z.infer<typeof LoginBody>


export const LoginBodyV2 = z
    .object({
        email: z.string().email(),
        password: z.string().min(6).max(100),
        totpCode: z.string()
    })
    .strict()

export type LoginBodyV2Type = z.infer<typeof LoginBodyV2>

export const LoginRes = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        role: z.enum(RoleValues)
    }),
    message: z.string()
})

export type LoginResType = z.infer<typeof LoginRes>


export const LogoutBody = z
    .object({
        accessToken: z.string(),
        refreshToken: z.string(),
    })
    .strict()

export type LogoutBodyType = z.infer<typeof LogoutBody>
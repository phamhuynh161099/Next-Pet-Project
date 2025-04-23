import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType, LoginBodyV2Type } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')


    if (!accessToken || !refreshToken) {
        return Response.json({ message: 'Khong nhan duoc access token hoac refresh token' }, { status: 200 })
    }

    try {
        const result = await authApiRequest.sLogout({
            accessToken,
            refreshToken
        })
        return Response.json(result.payload)
    } catch (error) {

        return Response.json({ message: 'Loi kho goi API den BE server' }, { status: 200 })

    }
}
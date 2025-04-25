import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) {
        return Response.json({ message: 'Khong tim thay refresh token' }, { status: 401 })
    }

    try {
        const { payload } = await authApiRequest.sRefreshToken({ refreshToken })
       
        const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }
        const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number }

        cookieStore.set('accessToken', payload.data.accessToke, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: decodedAccessToken.exp * 1000
        })

        cookieStore.set('refreshToken', payload.data.refreshToke, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: decodedRefreshToken.exp * 1000
        })

        return Response.json(payload)
    } catch (error) {

        console.log('>>>>',error)
        if (error instanceof HttpError) {
            return Response.json(error.payload, { status: error.status })
        } else {
            return Response.json({ message: 'Loi server' }, { status: 500 })
        }

    }
}
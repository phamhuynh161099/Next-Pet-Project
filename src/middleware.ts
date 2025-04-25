import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import path from 'path'

const privatePaths = ['/manage']
const unAuthPaths = ['/login', '/register']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value
    const isAuth = Boolean(request.cookies.get('accessToken'))
    console.log('is Auth', isAuth);

    /**
     * Chua dang nhap thi khong cho vao private [aths]
     */
    if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL('/login',request.url);
        url.searchParams.set('clearTokens','true')
        return NextResponse.redirect(url)
    }

    /**
     * Dang nhap roi khong cho vao login nua
     */
    // if (unAuthPaths.some(path => pathname.startsWith(path)) && refreshToken) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }


    /**
     * Truong hop dang nhap roi nhng accessToken het han 
     */
    // if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken && refreshToken) {
    //     const url = new URL('/refreshToken', request.url);
    //     url.searchParams.set('redirect', refreshToken)
    //     return NextResponse.redirect(url)
    // }



    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/manage/:path*', '/login', '/register']
}
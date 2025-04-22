import envConfig from "@/config";
import { normalizePath } from "@/lib/utils"
import { LoginResType } from '@/schemaValidations/auth.schema'
import { redirect } from "next/navigation";


type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EnityErrorPayload = {
    message: string
    errors: {
        field: string
        message: string
    }[]
}

export class HttpError extends Error {
    status: number
    payload: {
        message: string
        [key: string]: any
    }

    constructor({ status, payload, message = 'Loi HTTP' }: { status: number; payload: any; message?: string }) {
        super(message)
        this.status = status
        this.payload = payload
    }
}

/**
 * Error cho cac loi thuoc ve sai cac truong thong tin
 */
export class EntityError extends HttpError {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EnityErrorPayload
    constructor({ status, payload }: {
        status: typeof ENTITY_ERROR_STATUS,
        payload: EnityErrorPayload

    }) {
        super({ status, payload, message: 'Loi cac truong thong tin' })
        this.status = status
        this.payload = payload
    }
}

let clientLogoutRequest: null | Promise<any> = null
/**
 * Kiểm tra xem file này đang chạy ở Next-Client hay Next-Server
 */
export const isClient = typeof window !== 'undefined'

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions | undefined
) => {
    let body: FormData | string | undefined = undefined
    if (options?.body instanceof FormData) {
        body = options.body
    } else {
        body = JSON.stringify(options?.body)
    }

    const baseHeaders: {
        [key: string]: string
    } =
        body instanceof FormData
            ? {}
            : {
                'Content-Type': 'application/json',
            }

    if (isClient) {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            baseHeaders['Authorization'] = `Bearer ${accessToken}`
        }
    }

    /**
     * Nếu khoogn truyền BaseUrl hoặc =Undifined thì là gọi BE
     * Nếu truyền thì giá trị , '' -> là gọi NextJS-Server
     */

    const baseUrl = options?.baseUrl === undefined
        ? envConfig.NEXT_PUBLIC_API_ENDPOINT
        : options.baseUrl;

    const fullUrl = `${baseUrl}${normalizePath(url)}`
    const res = await fetch(fullUrl, {
        ...options,
        method,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        },
        body,
    })

    const payload: Response = await res.json();
    const data = {
        status: res.status,
        payload,
    }

    if (!res.ok) {
        if (res.status === ENTITY_ERROR_STATUS) {
            throw new EntityError(data as {
                status: 422
                payload: EnityErrorPayload
            })
        } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
            if (isClient) {
                if (!clientLogoutRequest) {
                    clientLogoutRequest = fetch('/api/auth/logout', {
                        method: 'POST',
                        // body: JSON.stringify({ force: true }),
                        body: null, //*
                        headers: {
                            ...baseHeaders
                        }
                    });

                    try {
                        await clientLogoutRequest
                    } catch (error) {

                    } finally {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');

                        location.href = '/login';
                    }

                }
            } else {
                const accessToken = (options?.headers as any)?.Authorization?.split(' ')[1]
                redirect(`/logout?accessToken=${accessToken}`)
            }
        } else {
            throw new HttpError(data)
        }
    }


    if (isClient) {
        const normalizeUrl = normalizePath(url)
        if (
            normalizeUrl === 'api/auth/login'
        ) {
            const { accessToken, refreshToken } = (payload as LoginResType).data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)

        } else if (normalizeUrl === 'api/auth/logout') {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    }


    return data;

}

const http = {
    get<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('GET', url, options);
    },

    post<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('POST', url, { ...options, body });
    },

    put<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('PUT', url, { ...options, body });
    },

    delete<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('DELETE', url, { ...options });
    }
};












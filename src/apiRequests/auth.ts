import { http } from "@/lib/http";
import { LoginBodyType, LoginBodyV2Type, LoginResType, LogoutBodyType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
    sLogin: (body: LoginBodyV2Type) => http.post<LoginResType>('/auth/login', body),
    login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, {
        baseUrl: ''
    }),
    sLogout: (body: LogoutBodyType) => http.post<any>('/auth/logout', {
        refreshToken: body.refreshToken
    }, {
        headers: {
            Authorization: `Bearer ${body.accessToken}`
        }
    }),
    logout: () => http.post<any>('/api/auth/logout', null, { baseUrl: '' }),
    sRefreshToken: (body: any) => http.post<any>('/auth/refresh-token', null, {
        headers: {
            Authorization: `Bearer ${body['refreshToken']}`
        }
    }),
    refreshToken: () => http.post<any>('/api/auth/refresh-token', null, {
        baseUrl: ''
    }),
}

export default authApiRequest;

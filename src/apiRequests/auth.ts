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
}

export default authApiRequest;

import { http } from "@/lib/http";
import { LoginBodyType, LoginBodyV2Type, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
    sLogin: (body: LoginBodyV2Type) => http.post<LoginResType>('/auth/login', body),
    login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, {
        baseUrl: ''
    }),
}

export default authApiRequest;

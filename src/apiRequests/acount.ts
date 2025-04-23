import { http } from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const accountApiRequest = {
    me: () => http.get<AccountResType>('/account/me'),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/account/me', body),
}

export default accountApiRequest;

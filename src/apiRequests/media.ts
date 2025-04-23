import { http } from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const mediaApiRequest = {
    uppload: (formData: FormData) => http.post('/media/upload', formData)
}

export default mediaApiRequest;

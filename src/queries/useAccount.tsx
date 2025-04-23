import accountApiRequest from "@/apiRequests/acount";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useQuery } from "@tanstack/react-query";

export const useAccountProfile = (
  onSuccess?: (data: AccountResType) => void
) => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        onSuccess && onSuccess(res.payload);
        return res;
      }),
  });
};

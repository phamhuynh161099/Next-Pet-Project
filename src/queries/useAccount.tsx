import accountApiRequest from "@/apiRequests/acount";
import mediaApiRequest from "@/apiRequests/media";
import {
  AccountResType
} from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAccountMe = (onSuccess?: (data: AccountResType) => void) => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        onSuccess && onSuccess(res.payload);
        return res;
      }),
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.uppload,
  });
};

export const useUpdateMediaMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.uppload,
  });
};


/**
 * 
 *  
 */
export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaApiRequest.uppload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
    },
  });

}
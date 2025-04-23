import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMuatation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};


export const useLogoutMuatation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
  });
};
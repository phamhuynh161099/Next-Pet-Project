import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "sonner"

import jwt from 'jsonwebtoken'
import authApiRequest from "@/apiRequests/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Xoa di ky tu '/' dau tien cua path
*/
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}



export const handleErrorApi = ({ error, setError, duration }: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(error => {
      setError(error.field, {
        type: 'manual',
        message: error.message
      })

    })
  } else {
    toast.error(error?.payload?.message ?? 'Lỗi không xác định')
  }
}

const isClient = typeof window !== 'undefined'

export const getAccessTokenFromLS = () => {
  return isClient ? localStorage.getItem('accessToken') : null
}


export const setAccessTokenFromLS = (value: string) => {
  isClient && localStorage.setItem('accessToken', value)
}

export const getRefreshTokenFromLS = () => {
  return isClient ? localStorage.getItem('refreshToken') : null
}

export const setRefreshTokenFromLS = (value: string) => {
  isClient && localStorage.setItem('refreshToken', value)
}

export const removeTokenFromLS = () => {
  isClient && localStorage.removeItem('accessToken');
  isClient && localStorage.removeItem('refreshToken');
}

export const checkAndRefreshToken = async (param?: {
  onError?: () => void,
  onSuccess?: () => void
}) => {
  // Lấy token mới mỗi lần gọi hàm để tránh dùng token cũ đã lưu
  const accessToken = getAccessTokenFromLS();
  const refreshToken = getRefreshTokenFromLS();

  // Không làm gì nếu thiếu token
  if (!accessToken || !refreshToken) return;

  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };

  // Chuyển đổi thời gian hiện tại sang epoch seconds
  const now = (Date.now() / 1000) - 1;

  // Kiểm tra refresh token hết hạn
  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLS();
    param?.onError && param.onError()
    return;
  }

  // Tính toán thời gian còn lại của access token
  const accessTokenLifetime =
    decodedAccessToken.exp - decodedAccessToken.iat;
  const remainingTime = decodedAccessToken.exp - now;

  // Chỉ refresh khi còn 1/3 thời gian sống của token
  if (remainingTime < accessTokenLifetime / 3) {
    try {
      const res = await authApiRequest.refreshToken();

      // Cập nhật token mới
      setAccessTokenFromLS(res.payload.data.accessToken);
      setRefreshTokenFromLS(res.payload.data.refreshToken);

      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
};

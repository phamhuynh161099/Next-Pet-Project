import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "sonner"

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
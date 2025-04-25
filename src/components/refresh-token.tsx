"use client";
import authApiRequest from "@/apiRequests/auth";
import {
  checkAndRefreshToken,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenFromLS,
  setRefreshTokenFromLS,
} from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

// Các path không cần check refresh token
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Bỏ qua nếu ở trang không yêu cầu xác thực
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;

    let interval: any = null;

    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push('/logout')
      },
    });

    // Thời gian interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ: nếu access token hết hạn sau 10s thì cứ 1s kiểm tra 1 lần
    const TIMEOUT = 1000; // 1 giây
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
          },
        }),
      TIMEOUT
    );

    // Cleanup khi component unmount hoặc pathname thay đổi
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pathname,router]);

  return null; // Component này không render gì cả
}

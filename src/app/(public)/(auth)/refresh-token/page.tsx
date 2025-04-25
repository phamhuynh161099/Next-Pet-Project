"use client";

import { checkAndRefreshToken, getRefreshTokenFromLS } from "@/lib/utils";
import { useLogoutMuatation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");

  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLS()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || "/");
        },
      });
    }
  }, [refreshTokenFromUrl, router, redirectPathname]);
  return <div>Refresh token...</div>;
}

export default RefreshTokenPage;

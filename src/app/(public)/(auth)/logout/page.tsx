"use client";

import { getRefreshTokenFromLS } from "@/lib/utils";
import { useLogoutMuatation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

function LogoutPage() {
  const { mutateAsync } = useLogoutMuatation();
  const router = useRouter();
  const ref = useRef<any>(null);

  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");

  useEffect(() => {
    if (ref.current 
        || refreshTokenFromUrl !== getRefreshTokenFromLS()
    ) {
      return;
    }
    ref.current = mutateAsync;
    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/");
    });
  }, [mutateAsync, router]);
  return <div>LogoutPage</div>;
}

export default LogoutPage;

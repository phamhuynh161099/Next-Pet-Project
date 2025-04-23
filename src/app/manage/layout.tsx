'use client'

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { handleErrorApi } from "@/lib/utils";
import { useAccountProfile } from "@/queries/useAccount";
import { useLogoutMuatation } from "@/queries/useAuth";
import { useRouter } from "next/navigation";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const logoutMuatation = useLogoutMuatation();
  const {data} = useAccountProfile();
  const profile = data?.payload

  const logout = async () => {
    if (logoutMuatation.isPending) return;
    try {
      const result = await logoutMuatation.mutateAsync();
      console.log(result);
      router.push("/");
    } catch (error: any) {
      handleErrorApi({
        error
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <Button>Logout</Button>
          </div>
        </header>

        <div className="p-4">
          <div className="w-full overflow-x-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

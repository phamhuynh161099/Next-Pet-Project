"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, handleErrorApi } from "@/lib/utils";

import Image from "next/image";
import placholderImage from "../../../../../public/images/placeholder.jpg";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoginMuatation } from "@/queries/useAuth";
import { LoginBodyV2, LoginBodyV2Type } from "@/schemaValidations/auth.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ITotp {
  totp: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = new URLSearchParams(location.search);

  const loginMuatation = useLoginMuatation();
  const form = useForm<LoginBodyV2Type>({
    resolver: zodResolver(LoginBodyV2),
    defaultValues: {
      email: "",
      password: "",
      totpCode: "",
    },
  });

  const onSubmit = async (data: LoginBodyV2Type) => {
    if (loginMuatation.isPending) return;
    try {
      const result = await loginMuatation.mutateAsync(data);
      toast.success("Login successfull");
      router.push("/manage/dashboard");
    } catch (error: any) {

      console.log('error',error)
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Acme Inc account
                </p>
              </div>

              <div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit, (err) => {
                      console.warn(err);
                    })}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="shadcn"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totpCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TOTP</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="XXXXXX"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={placholderImage}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

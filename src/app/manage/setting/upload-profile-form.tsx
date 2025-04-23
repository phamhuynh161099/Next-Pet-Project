"use client";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import Image from "next/image";
import placholderImage from "../../../../public/images/placeholder.jpg";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAccountMe, useUpdateMediaMutation, useUpdateMeMutation } from "@/queries/useAccount";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function UplaodProfileForm() {
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data,refetch } = useAccountMe();

  const updateMeMutation = useUpdateMeMutation();
  const uploadMediaMutation = useUpdateMediaMutation();

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      avatar: "",
      name: "",
    },
  });

  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload;
      form.reset({
        name,
        avatar,
      });
    }
  }, [form, data]);

  const onSubmit = async (data: UpdateMeBodyType) => {
    console.log(data);
    if (updateMeMutation.isPending) return;
    try {
      let body = data
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadImageResult = await uploadMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = (uploadImageResult as any).payload.url;
        body = {
          ...data,
          avatar: imageUrl,
        };
      }

      const result = await updateMeMutation.mutateAsync(body as any);
      toast.success("Update success");
      console.log(result);

    } catch (error) {}
  };

  const avatar = form.watch("avatar");
  const previewAvatar = () => {
    if (file) {
      return URL.createObjectURL(file);
    }

    return avatar;
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6")}>
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
                        name="name"
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
                        name="avatar"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-2 items-start justify-start">
                              {/* Hiển thị avatar hiện tại */}
                              <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                <AvatarImage src={previewAvatar()} />
                                <AvatarFallback className="rounded-none">
                                  {field.value ? "---" : "No avatar"}
                                </AvatarFallback>
                              </Avatar>

                              {/* Input file ẩn */}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={avatarInputRef}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFile(file);
                                    field.onChange('http://localhost:3000')
                                  }
                                }}
                              />

                              {/* Nút upload */}
                              <button
                                className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 text-muted-foreground" />
                                <span className="sr-only">Upload</span>
                              </button>
                            </div>
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
    </>
  );
}

export default UplaodProfileForm;

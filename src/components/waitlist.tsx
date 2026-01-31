"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Field, FieldError } from "./ui/field";

const waitlistSchema = z.object({
  email: z.email().min(1, "Email cannot be empty."),
});

type WaitlistSchema = z.infer<typeof waitlistSchema>;

export function Waitlist() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<WaitlistSchema>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: WaitlistSchema) {
    try {
      setIsLoading(true);

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          payload?.error ?? "Something went wrong. Please try again later.";

        toast.error(message);
        return;
      }

      toast.success(
        payload?.message ??
          "Successfully joined waitlist! You will receive a confirmation email in 1 minute."
      );

      form.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      id="waitlist-form"
      className="flex h-full w-full flex-col gap-2 sm:flex-row"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              className="bg-accent focus:ring-input! hover:border-input border-transparent text-lg! transition-colors placeholder:text-lg hover:cursor-pointer focus:ring-1! focus-visible:border-transparent!"
              placeholder="Enter email"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        type="submit"
        form="waitlist-form"
        variant={null}
        size={null}
        disabled={isLoading}
        className={cn(
          "text-background bg-[#57A3FA] px-4 py-2 text-lg transition-colors hover:bg-[#3993F9] has-[>svg]:px-3",
          !isLoading ? "h-full" : ""
        )}
      >
        {isLoading ? (
          <div className="flex size-full items-center justify-center">
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          </div>
        ) : (
          "Join Waitlist"
        )}
      </Button>
    </form>
  );
}

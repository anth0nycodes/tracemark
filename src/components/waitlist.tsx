"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldError } from "./ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

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
          "Successfully joined waitlist! You will receive a confirmation email in 1 minute.",
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
      className="flex flex-col sm:flex-row gap-2 w-full"
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
              className="bg-accent focus-visible:border-transparent! focus:ring-input! focus:ring-1! border-transparent hover:cursor-pointer placeholder:text-lg text-lg! hover:border-input transition-colors"
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
        className="text-lg text-background bg-[#57A3FA] hover:bg-[#3993F9] h-full transition-colors"
      >
        {isLoading ? (
          <LoaderCircle className="size-5" aria-hidden="true" />
        ) : (
          "Join Waitlist"
        )}
      </Button>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { type ContactResult, sendContactMessage } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_TOPICS,
  type ContactInput,
  type ContactTopic,
  contactSchema,
  topicLabel,
} from "@/lib/validation/contact";

const MAX_MESSAGE = 4000;

export function ContactForm({
  defaultTopic = "general",
}: {
  defaultTopic?: ContactTopic;
}) {
  const [result, setResult] = useState<ContactResult | null>(null);
  const [renderedAt] = useState(() => Date.now());
  const formErrorRef = useRef<HTMLDivElement>(null);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      topic: defaultTopic,
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (result?.status === "error") formErrorRef.current?.focus();
  }, [result]);

  async function onSubmit(values: ContactInput) {
    setResult(await sendContactMessage({ ...values, renderedAt }));
  }

  if (result?.status === "success") {
    return <ContactSuccess result={result} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {result?.formError ? (
          <div
            ref={formErrorRef}
            tabIndex={-1}
            role="alert"
            className="flex gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            {result.formError}
          </div>
        ) : null}

        {/* Honeypot */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="contact-website">Leave this field empty</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Controller
          name="topic"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="contact-topic">
                What&apos;s your message about?
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value || null}
                onValueChange={(value: string | null) =>
                  field.onChange(value ?? "")
                }
              >
                <SelectTrigger
                  id="contact-topic"
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  {/* Base UI renders the raw value, so map it to its label. */}
                  <SelectValue>
                    {(value: string | null) =>
                      value ? topicLabel(value) : "Choose an option"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_TOPICS.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="contact-name">Your name</FieldLabel>
              <Input
                {...field}
                id="contact-name"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="contact-email">Email address</FieldLabel>
              <Input
                {...field}
                id="contact-email"
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="subject"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="contact-subject">
                Subject{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="contact-subject"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="message"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="contact-message">Your message</FieldLabel>
              <Textarea
                {...field}
                id="contact-message"
                rows={7}
                maxLength={MAX_MESSAGE}
                placeholder="Tell us as much or as little as you like."
                aria-invalid={fieldState.invalid}
                className="min-h-40 resize-y"
              />
              <FieldDescription>
                {/* Only counts up once they're near the limit — a live counter
                    from the first character reads like being watched. */}
                {field.value.length > MAX_MESSAGE - 500
                  ? `${MAX_MESSAGE - field.value.length} characters left`
                  : "There's no rush, and no wrong way to write this."}
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send Message
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

function ContactSuccess({ result }: { result: ContactResult }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/12 text-success"
      >
        <Check className="size-7" />
      </span>

      <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
        Thank you for writing to us
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Your message has reached us. One of us will read it properly and reply —
        we&apos;re a small team, so it may take a couple of days, but you will
        hear back.
      </p>

      <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-muted-foreground">
        {result.emailFailed
          ? "We couldn't send you a confirmation email just now, but your message has reached us safely."
          : "We've emailed you a copy of this confirmation."}
      </p>
    </div>
  );
}

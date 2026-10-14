"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Arrow from "@/components/Arrow";
import DotGrid from "@/components/DotGrid";
import SectionHeading from "@/components/SectionHeading";
import { contact, footer, services } from "@/lib/content";
import { CONTACT_FIRST_FIELD_ID } from "@/lib/navigation";

type Field = "name" | "email" | "phone" | "service" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "success" | "error";

const FIELD_ORDER: Field[] = ["name", "email", "phone", "service", "message"];
const FIELD_IDS: Record<Field, string> = {
  name: CONTACT_FIRST_FIELD_ID,
  email: "contact-email",
  phone: "contact-phone",
  service: "contact-service",
  message: "contact-message",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[0-9+ ]+$/;
const MIN_PHONE_DIGITS = 7;

const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
const { form } = contact;

const serviceOptions = [
  ...services.pillars.flatMap((pillar) => pillar.services.map((service) => service.name)),
  form.notSure,
];

const emptyValues: Values = { name: "", email: "", phone: "", service: form.notSure, message: "" };

function validateField(field: Field, values: Values): string | undefined {
  const value = values[field].trim();
  if (field === "name") return value ? undefined : form.errors.name;
  if (field === "email") return EMAIL_PATTERN.test(value) ? undefined : form.errors.email;
  if (field === "phone") {
    const digits = value.replace(/\D/g, "").length;
    return PHONE_PATTERN.test(value) && digits >= MIN_PHONE_DIGITS ? undefined : form.errors.phone;
  }
  return undefined;
}

const CONTROL =
  "w-full rounded-[20px] border-2 bg-white px-5 text-ink disabled:opacity-70";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-small font-semibold">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-0.5 shrink-0">
        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 5.5v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14.25" r="1" fill="currentColor" />
      </svg>
      {message}
    </p>
  );
}

export default function Contact() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const change = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateField(field, next) }));
  };

  const blur = (field: Field) => {
    if (!submitted && !values[field]) return;
    setErrors((current) => ({ ...current, [field]: validateField(field, values) }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found: Errors = {};
    FIELD_ORDER.forEach((field) => {
      const message = validateField(field, values);
      if (message) found[field] = message;
    });
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus();
      return;
    }

    setStatus("sending");
    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error(String(response.status));
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const control = (field: Field, size: string) => ({
    id: FIELD_IDS[field],
    name: field,
    value: values[field],
    onBlur: () => blur(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${FIELD_IDS[field]}-error` : undefined,
    disabled: status === "sending",
    className: `${CONTROL} ${size} ${errors[field] ? "border-ink" : "border-transparent"}`,
  });

  const label = (field: Field, text: string, extra?: string) => (
    <label htmlFor={FIELD_IDS[field]} className="mb-2 block font-semibold">
      {text}
      {extra && <span className="font-normal"> {extra}</span>}
    </label>
  );

  return (
    <section
      id="contact"
      data-header-theme="dark"
      aria-labelledby="contact-title"
      className="section defer-render surface-brand relative overflow-hidden bg-brand text-white [--defer-h:1500px] md:[--defer-h:1250px] lg:[--defer-h:1050px]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="glow -right-24 top-0 h-[520px] w-[520px]" />
        <span
          className="glow -bottom-32 left-[8%] h-[420px] w-[420px]"
          style={{ animationDelay: "-9s", animationDirection: "alternate-reverse" }}
        />
        <DotGrid className="absolute bottom-[10%] right-0 top-[12%] hidden w-[min(58%,720px)] md:grid" />
      </div>
      <div className="wrap relative">
        <SectionHeading
          id="contact-title"
          lines={contact.headingLines}
          className="mx-auto max-w-[24ch] text-balance text-center"
        />

        <div className="mt-[clamp(32px,6vh,56px)] grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-0">
          <div className="sd-left lg:pr-16" data-sd="left">
            <div className="rounded-[24px] border border-white/25 bg-white/10 p-6 backdrop-blur-[20px] sm:p-10">
            <p>{contact.line}</p>

            {status === "success" ? (
              <div
                ref={successRef}
                role="status"
                tabIndex={-1}
                className="mt-8 flex items-start gap-4 rounded-panel border-2 border-lilac p-6 focus:outline-none sm:p-8"
              >
                <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
                  <circle cx="14" cy="14" r="12.5" stroke="currentColor" strokeWidth="2" />
                  <path d="M8.5 14.5l3.8 3.8 7.2-7.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-h3 font-semibold">{form.success}</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  {label("name", form.fields.name)}
                  <input
                    type="text"
                    autoComplete="name"
                    aria-required="true"
                    {...control("name", "h-12")}
                    onChange={(event) => change("name", event.target.value)}
                  />
                  <FieldError id={`${FIELD_IDS.name}-error`} message={errors.name} />
                </div>
                <div>
                  {label("email", form.fields.email)}
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    aria-required="true"
                    {...control("email", "h-12")}
                    onChange={(event) => change("email", event.target.value)}
                  />
                  <FieldError id={`${FIELD_IDS.email}-error`} message={errors.email} />
                </div>
                <div>
                  {label("phone", form.fields.phone)}
                  <input
                    type="tel"
                    autoComplete="tel"
                    aria-required="true"
                    {...control("phone", "h-12")}
                    onChange={(event) => change("phone", event.target.value)}
                  />
                  <FieldError id={`${FIELD_IDS.phone}-error`} message={errors.phone} />
                </div>
                <div>
                  {label("service", form.fields.service)}
                  <div className="relative">
                    <select
                      {...control("service", "h-12 appearance-none pr-12")}
                      onChange={(event) => change("service", event.target.value)}
                    >
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-ink"
                    >
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  {label("message", form.fields.message, form.optional)}
                  <textarea
                    rows={5}
                    maxLength={form.messageMax}
                    {...control("message", "min-h-32 py-3")}
                    onChange={(event) => change("message", event.target.value)}
                  />
                  <p className="mt-2 text-small">
                    {values.message.length} / {form.messageMax}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  {status === "error" && (
                    <p role="alert" className="mb-4 flex items-start gap-2 font-semibold">
                      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-1 shrink-0">
                        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 5.5v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="10" cy="14.25" r="1" fill="currentColor" />
                      </svg>
                      {form.submitError}
                    </p>
                  )}
                  <button type="submit" disabled={status === "sending"} className="btn btn-white disabled:cursor-wait">
                    {status === "sending" ? form.sending : form.submit}
                    <Arrow />
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>

          <address className="sd-right not-italic lg:border-l lg:border-lilac lg:pl-16" data-sd="right">
            <p>{contact.office.address}</p>
            <ul className="mt-8 flex flex-col gap-3 font-semibold">
              {contact.office.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="u-link py-1"
                  >
                    {phone.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={contact.office.email.href}
                  className="u-link py-1"
                >
                  {contact.office.email.label}
                </a>
              </li>
              <li>
                <a
                  href={contact.office.whatsapp.href}
                  aria-label={`${contact.office.whatsapp.label}, ${footer.newTab}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-link py-1"
                >
                  {contact.office.whatsapp.label}
                </a>
              </li>
            </ul>
            <p className="mt-8">{contact.office.hours}</p>
          </address>
        </div>
      </div>
    </section>
  );
}

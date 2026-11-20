"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckCircle2, RotateCcw, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { setSupportRequestStatus } from "@/lib/support-actions";
import type { SupportRequestInput } from "@/lib/types";

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors duration-200 motion-reduce:transition-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

const SECURITY_WARNING = "Do not enter card numbers, CVV, PIN, OTP or passwords here.";

export function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);

    try {
      const supabase = createClient();
      const payload: SupportRequestInput = {
        name: name.trim(),
        email: email.trim(),
        topic: topic.trim(),
        message: message.trim(),
        status: "open",
      };
      const { error } = await supabase.from("support_requests").insert(payload);

      if (error) {
        setFeedback({ tone: "error", text: error.message });
        return;
      }

      setName("");
      setEmail("");
      setTopic("");
      setMessage("");
      setFeedback({ tone: "success", text: "Thanks - your support request has been sent." });
    } catch (caught: unknown) {
      setFeedback({
        tone: "error",
        text: caught instanceof Error ? caught.message : "Your request could not be sent.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
        {SECURITY_WARNING}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="support-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="support-name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="support-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="support-email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="support-topic" className="mb-1.5 block text-sm font-medium text-slate-700">
          Topic
        </label>
        <input
          id="support-topic"
          type="text"
          required
          maxLength={120}
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          className={fieldClass}
          placeholder="A question about a payment guide"
        />
      </div>

      <div>
        <label htmlFor="support-message" className="mb-1.5 block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="support-message"
          rows={6}
          required
          maxLength={5000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={fieldClass}
          placeholder="Describe your request in plain language."
        />
      </div>

      {feedback ? (
        <p
          role={feedback.tone === "error" ? "alert" : "status"}
          className={`rounded-lg border px-3 py-2 text-sm ${
            feedback.tone === "error"
              ? "border-error/30 bg-error-light text-error-dark"
              : "border-success/30 bg-success-light text-success-dark"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 motion-reduce:transition-none hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send aria-hidden="true" size={16} />
        {pending ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}

export interface SupportStatusControlProps {
  id: string;
  status: string;
}

export function SupportStatusControl({ id, status }: SupportStatusControlProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const resolved = status === "resolved";
  const nextStatus: "open" | "resolved" = resolved ? "open" : "resolved";

  async function handleClick() {
    setPending(true);
    setError("");

    try {
      const result = await setSupportRequestStatus(id, nextStatus);
      if (!result.ok) {
        setError(result.error ?? "Status could not be updated.");
        return;
      }
      router.refresh();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Status could not be updated.");
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={pending}
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50 ${
          resolved
            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
            : "border-success/30 text-success-dark hover:bg-success-light"
        }`}
      >
        {resolved ? (
          <RotateCcw aria-hidden="true" size={13} />
        ) : (
          <CheckCircle2 aria-hidden="true" size={13} />
        )}
        {pending ? "Updating..." : resolved ? "Reopen" : "Mark resolved"}
      </button>
      {error ? (
        <span role="alert" className="max-w-40 text-right text-[11px] text-red-600">
          {error}
        </span>
      ) : null}
    </span>
  );
}

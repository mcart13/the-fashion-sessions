"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

export default function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openMailClient = (data: {
    email: string;
    message: string;
    name: string;
    subject: string;
  }) => {
    const lines = [
      `Name: ${data.name || "Not provided"}`,
      `Email: ${data.email || "Not provided"}`,
      `Inquiry: ${data.subject || "General inquiry"}`,
      "",
      data.message || "No message provided.",
    ];

    const mailto = new URL("mailto:tracy@thefashionsessions.com");
    mailto.searchParams.set("subject", data.subject || "Website contact form");
    mailto.searchParams.set("body", lines.join("\n"));

    window.location.href = mailto.toString();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitted(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        if (response.status === 503) {
          openMailClient({ email, message, name, subject });
          return;
        }

        setError(payload?.error ?? "Something went wrong. Please try again.");
        return;
      }

      form.reset();
      setSubmitted(true);
    } catch {
      openMailClient({ email, message, name, subject });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      if (form) form.requestSubmit();
    }
  };

  const inputClass =
    "w-full border border-[#ddd] bg-[#fafafa] px-4 py-3 font-poppins text-base text-text-dark outline-none transition-colors focus:border-accent-gold focus:outline-2 focus:outline-text-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="website"
        hidden
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
      />
      <div>
        <label className="mb-2 block font-poppins text-[11px] uppercase tracking-[1px] text-black">
          Your Name*
        </label>
        <input
          type="text"
          name="name"
          required
          aria-invalid={error !== null ? true : undefined}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-2 block font-poppins text-[11px] uppercase tracking-[1px] text-black">
          Your Email*
        </label>
        <input
          type="email"
          name="email"
          required
          aria-invalid={error !== null ? true : undefined}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-2 block font-poppins text-[11px] uppercase tracking-[1px] text-black">
          What are you inquiring about?
        </label>
        <input type="text" name="subject" className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block font-poppins text-[11px] uppercase tracking-[1px] text-black">
          Your Message
        </label>
        <textarea
          name="message"
          rows={6}
          onKeyDown={handleTextareaKeyDown}
          className={`${inputClass} resize-vertical`}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-btn-cta px-[30px] py-[15px] font-poppins text-[12px] tracking-[0.9px] text-text-dark transition-[background-color,transform] hover:bg-tan active:scale-[0.97]"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>

      <div aria-live="polite" className="min-h-[24px]">
        {submitted ? (
          <p className="font-poppins text-sm text-[#2d6a4f] transition-opacity duration-200 ease-out">
            Thanks. Your message is on its way.
          </p>
        ) : null}
        {error ? (
          <p className="font-poppins text-sm text-[#b91c1c] transition-opacity duration-200 ease-out">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}

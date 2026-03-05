import Link from "next/link";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/thefashionsessions/",
  },
  {
    name: "Pinterest",
    href: "https://pin.it/7o6bmQb",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/thefashionsessions",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@thefashionsessions",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@thefashionsessions",
  },
];

function SocialIcon({ name }: { name: string }) {
  const cls = "w-5 h-5";
  switch (name) {
    case "Facebook":
      return (
        <svg
          className={cls}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case "Pinterest":
      return (
        <svg
          className={cls}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.81-2.425.853 0 1.265.641 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.48 1.806 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.282a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg
          className={cls}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg
          className={cls}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.13a8.16 8.16 0 005.58 2.2V11.3a4.85 4.85 0 01-3.15-1.16V6.69h3.15z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg
          className={cls}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-tan py-16 text-center">
        <h1 className="font-moontime text-[80px] leading-none text-heading-dark">
          Contact Us
        </h1>
        <p className="mt-4 font-poppins text-sm font-semibold uppercase tracking-[0.25em] text-text-dark">
          WE CAN&apos;T WAIT TO HEAR FROM YOU
        </p>
      </section>

      {/* Two-column Content */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left Column - Info */}
          <div>
            <h2 className="font-poppins text-sm font-bold uppercase tracking-widest text-heading-dark">
              EMAIL
            </h2>
            <Link
              href="mailto:tracy@thefashionsessions.com"
              className="mt-2 block font-poppins text-sm text-accent-gold hover:underline"
            >
              tracy@thefashionsessions.com
            </Link>
            <p className="mt-4 font-poppins text-sm leading-relaxed text-text-dark">
              Have a question or comment? I would love to hear from you! Email
              me with your questions, thoughts, or just to say hello!
            </p>
            <p className="mt-4 font-poppins text-sm leading-relaxed text-text-dark">
              Looking to advertise or collaborate? I would love to work with
              you!
            </p>

            <h2 className="mt-10 font-poppins text-sm font-bold uppercase tracking-widest text-heading-dark">
              SOCIAL
            </h2>
            <div className="mt-4 flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-dark transition-colors hover:text-accent-gold"
                  aria-label={social.name}
                >
                  <SocialIcon name={social.name} />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <form
              action="https://formspree.io/f/placeholder"
              method="POST"
              className="space-y-5"
            >
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name*"
                  required
                  className="w-full border border-[#ddd] px-4 py-3 font-poppins text-sm text-text-dark outline-none focus:border-accent-gold"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email*"
                  required
                  className="w-full border border-[#ddd] px-4 py-3 font-poppins text-sm text-text-dark outline-none focus:border-accent-gold"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="What are you inquiring about?"
                  className="w-full border border-[#ddd] px-4 py-3 font-poppins text-sm text-text-dark outline-none focus:border-accent-gold"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={6}
                  className="w-full resize-vertical border border-[#ddd] px-4 py-3 font-poppins text-sm text-text-dark outline-none focus:border-accent-gold"
                />
              </div>
              <button
                type="submit"
                className="bg-btn-cta px-8 py-3 font-poppins text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

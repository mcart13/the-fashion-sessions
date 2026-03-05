"use client";

export default function NewsletterSection() {
  return (
    <section className="bg-white py-[60px] px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Envelope icon */}
        <div className="mb-4">
          <svg
            className="w-10 h-10 mx-auto text-text-dark"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.5-9.75-6.5"
            />
          </svg>
        </div>

        {/* Main heading in Moontime */}
        <h2 className="font-moontime text-[48px] leading-tight text-[#282828] mb-3">
          Sign up to receive my newsletter, and be the first to receive
          subscriber-only offers!
        </h2>

        {/* Subtext in Poppins */}
        <p className="font-poppins text-sm text-text-dark mb-6">
          Sign up to receive my weekly newsletter and be the first to know about
          exclusive offers.
        </p>

        {/* Email form */}
        <form
          className="flex items-center justify-center gap-0 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email"
            className="flex-1 px-4 py-2.5 border border-gray-300 font-poppins text-sm text-text-dark outline-none focus:border-accent-gold"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-tan border border-[#e9cec5] font-poppins text-sm text-text-dark hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Lets Go
          </button>
        </form>
      </div>
    </section>
  );
}

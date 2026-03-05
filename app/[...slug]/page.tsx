import Link from "next/link";

export default function CatchAllPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-cream px-6">
      <div className="max-w-[600px] py-20 text-center">
        <h1 className="font-butler text-3xl text-heading-dark md:text-4xl">
          This blog post is being migrated to our new site.
        </h1>
        <p className="mt-6 font-roboto text-base leading-relaxed text-text-dark">
          Check back soon! We&apos;re working on bringing all our content to the
          new platform.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-accent-gold px-8 py-3 font-poppins text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

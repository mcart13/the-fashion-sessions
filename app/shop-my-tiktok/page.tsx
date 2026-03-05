const tiktokSections = [
  "Stopped by the Target Men's Section - Gray Hoodie Sweater",
  "Recreating Pinterest Looks as a Mom over 40 - Black & White",
  "Amazon...What I Ordered vs How it Looked - The Half-Zip Sweater",
  "What I Ordered vs How it Looked - Booty-covering Sweater",
  "Outfit Formula When You Have Nothing to Wear - Part 1",
  "Recreating Pinterest Looks on a Budget",
  "Recreating Pinterest Looks as a Mom over 40 - Blazer & Sweater Edition",
  "How it Looks on Mom & Daughter - Ugg Ultra Mini Boots",
];

export default function ShopMyTiktokPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:px-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="font-moontime text-[60px] leading-none text-heading-dark">
          Tracy&apos;s
        </span>
        <h1 className="font-butler text-3xl uppercase tracking-wide text-heading-dark md:text-4xl">
          Shop My Tiktok
        </h1>
        <p className="mt-3 font-poppins text-sm text-text-dark">
          Click on any items below to shop my TikTok looks!
        </p>
        <div className="mx-auto mt-4 h-px w-24 bg-accent-gold" />
      </div>

      {/* TikTok Sections */}
      <div className="space-y-12">
        {tiktokSections.map((title) => (
          <div key={title}>
            <h2 className="mb-4 font-roboto-slab text-xl font-medium text-heading-dark">
              {title}
            </h2>
            <div className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-gray-300 bg-white p-6">
              <p className="font-poppins text-sm text-gray-400">
                RewardStyle embed placeholder
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

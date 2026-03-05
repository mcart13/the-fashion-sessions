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
    <div className="bg-cream">
      {/* Header */}
      <div className="pt-[30px] pb-4 text-center">
        <h2 className="font-moontime text-[80px] leading-none text-[#282828]">
          Tracy&apos;s
        </h2>
        <h1 className="font-butler text-[48px] font-thin text-[#282828]">
          Shop My Tiktok
        </h1>
        <p className="mt-3 font-poppins text-[15px] text-[#282828]">
          Click on any items below to shop my TikTok looks!
        </p>
        <div className="mx-auto mt-5 h-px w-24 bg-[#282828]" />
      </div>

      {/* TikTok Sections */}
      <div className="mx-auto max-w-[1140px] px-5 py-10">
        <div className="space-y-12">
          {tiktokSections.map((title) => (
            <div key={title}>
              <h2 className="mb-4 font-butler text-[32px] font-thin text-[#282828]">
                {title}
              </h2>
              <div className="flex min-h-[200px] items-center justify-center bg-white/60 p-6">
                <p className="font-poppins text-sm text-[#282828]/40">
                  RewardStyle embed placeholder
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

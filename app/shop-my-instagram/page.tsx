import Sidebar from "@/components/Sidebar";

export default function ShopMyInstagramPage() {
  return (
    <div className="bg-cream">
      {/* Header */}
      <div className="pt-[30px] text-center">
        <h2 className="font-moontime text-[80px] leading-none text-[#282828]">
          Tracy&apos;s
        </h2>
        <h1 className="font-butler text-[48px] font-thin text-[#282828]">
          Shop My Instagram
        </h1>
        <div className="mx-auto mt-5 h-px w-24 bg-[#282828]" />
      </div>

      {/* Two-column Layout */}
      <div className="mx-auto max-w-[1140px] px-5 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main Content - LTK Widget */}
          <div className="lg:col-span-2">
            <div className="flex min-h-[400px] items-center justify-center bg-white/60 p-8">
              <p className="font-poppins text-sm text-[#282828]/60">
                LTK Shopping Widget - Loading...
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

import Sidebar from "@/components/Sidebar";

export default function ShopMyInstagramPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="font-moontime text-[60px] leading-none text-heading-dark">
          Tracy&apos;s
        </span>
        <h1 className="font-butler text-3xl uppercase tracking-wide text-heading-dark md:text-4xl">
          Shop My Instagram
        </h1>
        <div className="mx-auto mt-4 h-px w-24 bg-accent-gold" />
      </div>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main Content - LTK Widget */}
        <div className="lg:col-span-2">
          <div className="flex min-h-[400px] items-center justify-center border-2 border-dashed border-gray-300 bg-white p-8">
            <p className="font-poppins text-sm text-text-dark">
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
  );
}

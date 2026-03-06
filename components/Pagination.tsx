import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  pageCount,
  basePath,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1 py-8"
      aria-label="Pagination"
    >
      {Array.from({ length: pageCount }).map((_, index) => {
        const pageNumber = index + 1;
        const href =
          pageNumber === 1 ? basePath : `${basePath}?page=${pageNumber}`;

        return (
          <Link
            key={pageNumber}
            href={href}
            className={`flex h-11 min-w-11 items-center justify-center px-3 font-poppins text-sm transition-colors ${
              pageNumber === currentPage
                ? "bg-accent-gold text-white"
                : "text-text-dark hover:text-accent-gold"
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}
    </nav>
  );
}

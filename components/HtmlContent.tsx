import HtmlContentScripts from "@/components/HtmlContentScripts";

interface HtmlContentProps {
  className?: string;
  html: string;
  id: string;
}

export default function HtmlContent({ className, html, id }: HtmlContentProps) {
  return (
    <>
      <div
        id={id}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <HtmlContentScripts containerId={id} />
    </>
  );
}

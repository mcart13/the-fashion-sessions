import HtmlContentScripts from "@/components/HtmlContentScripts";

interface HtmlContentProps {
  className?: string;
  html: string;
  id: string;
}

function demoteH1s(html: string) {
  return html.replace(/<h1(\s|>)/gi, "<h2$1").replace(/<\/h1>/gi, "</h2>");
}

export default function HtmlContent({ className, html, id }: HtmlContentProps) {
  return (
    <>
      <div
        id={id}
        className={className}
        dangerouslySetInnerHTML={{ __html: demoteH1s(html) }}
      />
      <HtmlContentScripts containerId={id} />
    </>
  );
}

import { FlodeskForm } from "@/components/ThirdPartyEmbeds";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getInlineNewsletterFormId } from "@/lib/siteContent";

const inlineFormId = getInlineNewsletterFormId();

export default function NewsletterSection() {
  return (
    <section className="bg-white py-[60px] px-4">
      <AnimateOnScroll animation="fadeInUp">
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
          <h2 className="font-moontime text-[clamp(2.2rem,1rem+3.5vw,3rem)] leading-tight text-text-dark mb-3">
            Sign up to receive my newsletter, and be the first to receive
            subscriber-only offers!
          </h2>

          {/* Subtext in Poppins */}
          <p className="font-poppins text-sm text-text-dark mb-6">
            Sign up to receive my weekly newsletter and be the first to know
            about exclusive offers.
          </p>

          <div className="mx-auto max-w-md">
            {inlineFormId ? <FlodeskForm formId={inlineFormId} /> : null}
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

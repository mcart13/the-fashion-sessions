import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/metadata";
import { getContactVideoUrl } from "@/lib/siteContent";
import { SOCIAL_LINKS } from "@/lib/siteConfig";
import SocialIcon from "@/components/SocialIcon";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Tracy for questions, collaborations, and partnerships.",
  path: "/contact",
});

const contactSocialLinks = SOCIAL_LINKS.filter((s) => s.name !== "Amazon");

export default function ContactPage() {
  const contactVideoUrl = getContactVideoUrl();

  return (
    <div>
      <section className="relative overflow-hidden py-[40px] text-center md:py-[100px]">
        {contactVideoUrl ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={contactVideoUrl} type="video/mp4" />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10">
          <h1 className="font-butler text-[30px] font-thin leading-none text-white md:text-[clamp(3rem,1.7309rem+1.813vw,4rem)]">
            Contact Us
          </h1>
          <p className="mt-[10px] font-poppins text-[12px] tracking-[1.6px] text-white">
            WE CAN&apos;T WAIT TO HEAR FROM YOU
          </p>
        </div>
      </section>

      {/* Two-column Content */}
      <section className="bg-cream px-6 py-[50px] md:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-[42.54%_57.46%]">
          <div className="order-1 md:order-2 md:px-[50px]">
            <ContactForm />
          </div>

          {/* Left Column - Info */}
          <div className="order-2 md:order-1">
            <h2 className="font-poppins text-[14px] font-semibold uppercase tracking-[2px] text-text-dark">
              Email
            </h2>
            <p className="mt-[5px] font-poppins text-[14px] tracking-[2.1px] text-text-dark break-all sm:break-normal">
              <Link
                href="mailto:tracy@thefashionsessions.com"
                className="hover:text-accent-gold"
              >
                tracy@thefashionsessions.com
              </Link>
            </p>
            <hr className="my-[10px] w-[8%] border-t border-text-dark" />
            <p className="mt-[5px] font-poppins text-[14px] tracking-[0.8px] text-text-dark">
              Have a question or comment? I would love to hear from you! Email
              me with your questions, thoughts, or just to say hello!
            </p>
            <p className="my-[10px] font-poppins text-[14px] tracking-[0.8px] text-text-dark">
              Looking to advertise or collaborate? I would love to work with
              you!
            </p>

            <h2 className="mt-[10px] font-poppins text-[14px] font-semibold uppercase tracking-[2px] text-text-dark">
              Social
            </h2>
            <div className="-ml-3 mt-2 flex items-center gap-0">
              {contactSocialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[44px] w-[44px] items-center justify-center text-text-dark transition-colors hover:text-accent-gold"
                  aria-label={social.name}
                >
                  <SocialIcon
                    name={social.name}
                    className="h-[15px] w-[15px]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

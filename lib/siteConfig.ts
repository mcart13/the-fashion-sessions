export const SITE_URL = "https://thefashionsessions.com";
export const SITE_NAME = "The Fashion Sessions";
export const SITE_DESCRIPTION = "A Fashion & Lifestyle Blog by Tracy";

export const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/thefashionsessions/",
  },
  {
    name: "Pinterest",
    href: "https://pin.it/7o6bmQb",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/thefashionsessions?igshid=YmMyMTA2M2Y=",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@thefashionsessions?_t=8ZdNKciRsJK&_r=1",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@thefashionsessions",
  },
  {
    name: "Amazon",
    href: "https://www.amazon.com/shop/influencer-1f538e5c?ref=cm_sw_em_r_inf_own_influencer-1f538e5c_dp_augtGkKyrmRUF",
  },
] as const;

export type SocialName = (typeof SOCIAL_LINKS)[number]["name"];

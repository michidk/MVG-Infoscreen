export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MVG Infoscreen",
  description:
    "A simple infoscreen for the Munich public transport system (MVG).",
  links: {
    github: "https://github.com/michidk/MVG-Infoscreen",
  },
  url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
};

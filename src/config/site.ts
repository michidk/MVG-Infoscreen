export type SiteConfig = typeof siteConfig;

function urlify(url: string | undefined) {
  if (!url) {
    return undefined;
  }
  if (url.startsWith("http") || url.startsWith("https")) {
    return url;
  }
  return `https://${url}`;
}

export const siteConfig = {
  name: "MVG Infoscreen",
  description:
    "A simple infoscreen for the Munich public transport system (MVG).",
  links: {
    github: "https://github.com/michidk/MVG-Infoscreen",
  },
  url: urlify(process.env.VERCEL_URL) || urlify(process.env.VERCEL_BRANCH_URL) || process.env.URL || "http://localhost:3000",
};

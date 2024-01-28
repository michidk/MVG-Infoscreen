export type SiteConfig = typeof siteConfig;

function urlify(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }
  if (url.startsWith("http") || url.startsWith("https")) {
    return url;
  }
  return `https://${url}`;
}

export function getServerUrl(): string {
  return urlify(process.env.NEXT_PUBLIC_VERCEL_URL) || urlify(process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL) || process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
}

export const siteConfig = {
  name: "MVG Infoscreen",
  description:
    "A simple infoscreen for the Munich public transport system (MVG).",
  links: {
    github: "https://github.com/michidk/MVG-Infoscreen",
  },
  url: getServerUrl(),
};

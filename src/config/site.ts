export type SiteConfig = typeof siteConfig;

function urlify(url: string): string {
	if (url.startsWith("http") || url.startsWith("https")) {
		return url;
	}
	return `https://${url}`;
}

export function getServerUrl(): string {
	return process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
		? "https://mvg-infoscreen.vercel.app"
		: urlify(
				process.env.NEXT_PUBLIC_VERCEL_URL ||
					process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ||
					process.env.NEXT_PUBLIC_URL ||
					"http://localhost:3000",
		  );
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

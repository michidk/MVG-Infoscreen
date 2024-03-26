import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [],
	authors: [
		{
			name: siteConfig.name,
			url: siteConfig.url,
		},
	],
	creator: siteConfig.name,
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<head />
			<body
				className={cn(
					"min-h-screen h-screen font-sans antialiased",
					fontSans.variable,
				)}
			>
				{children}
			</body>
		</html>
	);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.qrserver.com",
				port: "",
				pathname: "/v1/create-qr-code/**",
			},
		],
	},
};

module.exports = nextConfig;

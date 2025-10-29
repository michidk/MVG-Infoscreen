export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="w-full h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white p-6 flex flex-col">
			<div className="fixed top-5 text-lg right-8 text-right text-blue-300/80 font-medium backdrop-blur-sm bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-700/30 z-10">
				github.com/michidk/MVG-Infoscreen
			</div>

			<div className="flex-1 pt-2 overflow-auto">{children}</div>
		</div>
	);
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="w-full h-screen bg-blue-900 text-white p-5">
			<div className="fixed top-3 text-xl right-5 text-right text-slate-300">
				github.com/michidk/MVG-Infoscreen
			</div>

			{children}
		</div>
	);
}

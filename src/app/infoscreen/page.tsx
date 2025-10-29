"use server";

import { RenderStation } from "@/components/renderStation";
import { TransportBadges } from "@/components/transportBadges";
import { type BasicStationInfo, getStations } from "@/lib/stations";

type Props = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: Props) {
	const searchParams = await props.searchParams;
	const stationsParam = searchParams.stations as string;

	if (!stationsParam) {
		return <div>No station provided.</div>;
	}

	const stations: string[] = stationsParam.split(",");

	if (stations.length === 0) {
		return <div>No station provided.</div>;
	}

	let availableStations: Array<BasicStationInfo> = [];
	try {
		availableStations = await getStations();
	} catch (e) {
		const error = e as { message: string };
		return (
			<>
				<div>Could not load stations.</div>
				<div>{error.message}</div>
			</>
		);
	}

	const invalidStations = stations.filter(
		(station) =>
			!availableStations.find(
				(availableStation) => availableStation.id === station,
			),
	);

	if (invalidStations.length > 0) {
		return (
			<div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-950">
				<div className="bg-gradient-to-br from-red-800/90 to-red-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-700/50 p-10 max-w-2xl">
					<div className="text-center">
						<h1 className="text-5xl font-bold text-white mb-6">
							⚠️ Invalid Station{invalidStations.length > 1 ? "s" : ""}
						</h1>
						<p className="text-xl text-red-100 mb-6">
							The following station{invalidStations.length > 1 ? "s were" : " was"}{" "}
							not found:
						</p>
						<div className="bg-red-950/50 rounded-lg p-6 mb-6">
							<ul className="space-y-3">
								{invalidStations.map((station) => (
									<li
										key={station}
										className="text-2xl font-mono text-red-200 bg-red-900/30 rounded px-4 py-2"
									>
										{station}
									</li>
								))}
							</ul>
						</div>
						<p className="text-lg text-red-100">
							Please check the station IDs and try again.
						</p>
					</div>
				</div>
			</div>
		);
	}

	let stationInfos = availableStations.filter((station) =>
		stations.includes(station.id),
	);

	// Limit to maximum 6 stations
	stationInfos = stationInfos.slice(0, 6);

	// Determine grid columns based on number of stations
	let gridColsClass = "grid-cols-1";
	if (stationInfos.length === 2) {
		gridColsClass = "grid-cols-2";
	} else if (stationInfos.length >= 3) {
		gridColsClass = "grid-cols-3";
	}

	return (
		<div className={`grid ${gridColsClass} gap-10 h-full`}>
			{stationInfos.map((station) => (
				<div
					key={station.id}
					className="bg-gradient-to-br from-blue-800/90 to-blue-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-700/50 overflow-hidden flex flex-col"
				>
					<div className="bg-gradient-to-r from-blue-700 to-blue-600 px-10 py-8 border-b border-blue-600/50 flex items-center justify-between gap-8">
						<h1 className="text-7xl font-bold text-white tracking-tight flex-1">
							{station.name}
						</h1>
						<div
							className="flex items-center justify-end pr-8"
							style={{ minWidth: "fit-content" }}
						>
							<div className="scale-[2.5]">
								<TransportBadges products={station.products} size="md" />
							</div>
						</div>
					</div>
					<div className="p-8 flex-1">
						<RenderStation stationId={station.id} />
					</div>
				</div>
			))}
		</div>
	);
}

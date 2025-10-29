"use server";

import { RenderStation } from "@/components/renderStation";
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

	if (
		stations.some(
			(station) =>
				!availableStations.find(
					(availableStation) => availableStation.id === station,
				),
		)
	) {
		return <div>Invalid station provided.</div>;
	}

	const stationInfos = availableStations.filter((station) =>
		stations.includes(station.id),
	);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1920px] mx-auto">
			{stationInfos.map((station) => (
				<div
					key={station.id}
					className="bg-gradient-to-br from-blue-800/90 to-blue-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-700/50 overflow-hidden"
				>
					<div className="bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-6 border-b border-blue-600/50">
						<h1 className="text-5xl font-bold text-white tracking-tight">
							{station.name}
						</h1>
					</div>
					<div className="p-6">
						<RenderStation stationId={station.id} />
					</div>
				</div>
			))}
		</div>
	);
}

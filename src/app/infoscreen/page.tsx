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
		return (
			<>
				<div>Invalid station provided.</div>
			</>
		);
	}

	const stationInfos = availableStations.filter((station) =>
		stations.includes(station.id),
	);

	return (
		<>
			{stationInfos.map((station) => (
				<div key={station.id} className="mb-8">
					<h1 className="text-6xl pb-4">{station.name}</h1>
					<div className="w-full bg-blue-700">
						<RenderStation stationId={station.id} />
					</div>
				</div>
			))}
		</>
	);
}

"use server";

import { StationUrl } from "@/components/stationUrl";
import { type BasicStationInfo, getStations } from "@/lib/stations";

export default async function Page() {
	try {
		const stations: BasicStationInfo[] = await getStations();

		return (
			<>
				Select a station:
				<StationUrl stations={stations} />
			</>
		);
	} catch (e) {
		const error = e as { message: string };
		return (
			<>
				<div>Could not load stations.</div>
				<div>{error.message}</div>
			</>
		);
	}
}

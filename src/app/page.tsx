"use server";

import { getStations, Station } from "@/lib/stations";
import { StationUrl } from "@/components/stationUrl";

export default async function Page() {
	try {
		const stations: Station[] = await getStations();

		return (
			<>
				Select a station:
				<StationUrl stations={stations} />
			</>
		);
	} catch (e: any) {
		return (
			<>
				<div>Could not load stations.</div>
				<div>{e.message}</div>
			</>
		);
	}
}

"use server";

import { type Departure, getDepartures } from "@/lib/departures";

export async function getRecentDepartures(
	stationId: string,
	entries: number,
): Promise<Departure[]> {
	let departures = await getDepartures(stationId);

	// Filter out departures that are more than 10 minutes in the past
	const time = Date.now();
	departures = departures.filter(
		(departure) => (departure.realtimeDepartureTime - time) / (1000 * 60) > -10,
	);

	// Slice to get the first couple entries
	departures = departures.slice(0, entries);
	return departures;
}

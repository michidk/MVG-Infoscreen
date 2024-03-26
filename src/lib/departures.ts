import { fetchWithTimeout } from "./utils";

export interface Departure {
	realtimeDepartureTime: number;
	label: string;
	transportType: string;
	destination: string;
}

export async function getDepartures(stationId: string): Promise<Departure[]> {
	const response = await fetchWithTimeout(
		`https://www.mvg.de/api/fib/v2/departure?globalId=${stationId}`,
		{},
		10 * 1000,
	);
	if (response.status !== 200) {
		throw new Error("Could not get departures");
	}
	let departures = (await response.json()) as Array<Departure>;

	departures = departures.sort(
		(a, b) => a.realtimeDepartureTime - b.realtimeDepartureTime,
	);
	return departures;
}

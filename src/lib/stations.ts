import { fetchWithTimeout } from "./utils";

export type Station = {
	name: string;
	id: string;
};
export async function getStations() {
	const response = await fetchWithTimeout(
		"https://www.mvg.de/.rest/zdm/stations",
		{},
	);

	console.log("Stations status", response.status);
	if (!response.ok) {
		throw new Error("Could not get stations");
	}

	const stations: Array<any> = await response.json();

	return stations
		.filter(
			(station) =>
				station.products.length > 0 && station.tariffZones.length > 0,
		)
		.map((station) => ({
			name: station.name,
			id: station.id,
		}));
}

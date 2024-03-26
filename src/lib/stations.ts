import { fetchWithTimeout } from "./utils";

export interface Station {
	name: string;
	id: string;
	products: Array<string>;
	tariffZones: Array<string>;
}

export async function getStations(): Promise<Station[]> {
	const response = await fetchWithTimeout(
		"https://www.mvg.de/.rest/zdm/stations",
		{},
	);

	console.log("Stations status", response.status);
	if (!response.ok) {
		throw new Error("Could not get stations");
	}

	const stations = (await response.json()) as Array<Station>;

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

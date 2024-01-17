import { fetchWithTimeout } from "./utils";

const API_TIMEOUT = 1000 * 2;

export type Station = {
  name: string;
  id: string;
};

export async function getStations() {
  const response = await fetchWithTimeout("https://www.mvg.de/.rest/zdm/stations", {}, API_TIMEOUT);

  console.log("Stations status", response.status);
  if (!response.ok) {
    throw new Error("Could not get stations");
  }

  const stations: Array<any> = await response.json();

  return stations.map((station: any) => {
    return {
      name: station.name,
      id: station.id,
    };
  });
}

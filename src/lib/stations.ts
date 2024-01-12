import axios from "axios";

export type Station = {
  name: string;
  id: string;
};

let stations: Station[] = [];

export async function getStations() {
  if (stations.length == 0) {
    stations = await pollStations();
  }
  return stations;
}

export async function pollStations() {
  const response = await axios.get("https://www.mvg.de/.rest/zdm/stations");
  if (response.status !== 200) {
    throw new Error("Could not get stations");
  }

  const stations: any[] = response.data;

  return stations.map((station: any) => {
    return {
      name: station.name,
      id: station.id,
    };
  });
}
import axios, {AxiosResponse} from "axios";

const API_TIMEOUT:number = 1000 * 5; // 5 seconds

export type Station = {
  name: string;
  id: string;
};

export type apiReturnStation = {
  name: string,
  id: string,
  place: string,
  divaId: string,
  abbreviation: string,
  tariffZones: string,
  products: string[],
  latitude: number,
  longitude: number,
}


let stations: Station[] = [];

export async function getStations():Promise<Station[]> {
  if (stations.length == 0) {
    stations = await pollStations();
  }
  return stations;
}

export async function pollStations():Promise<Station[]>{
  const response:AxiosResponse<apiReturnStation[]> = await axios.get("https://www.mvg.de/.rest/zdm/stations", { timeout: API_TIMEOUT });
  if (response.status !== 200) {
    throw new Error("Could not get stations");
  }

  const stations: apiReturnStation[] = response.data;

  return stations.map((station: apiReturnStation):Station => {
    return {
      name: station.name,
      id: station.id,
    };
  });
}
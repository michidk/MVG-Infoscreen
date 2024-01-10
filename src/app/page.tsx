"use server";

import { Station, getStations } from "@/lib/stations"
import { StationUrl } from "@/components/stationUrl";

let stations: Station[] = [];

export default async function Page() {
  if (stations.length == 0) {
    stations = (await getStations()).slice(0,10);
  }

  return (
    <>
      Select a station:
      <StationUrl stations={stations}/>
    </>
  );
}

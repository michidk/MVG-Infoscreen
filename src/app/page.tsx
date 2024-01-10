"use server";

import { Station, getStations } from "@/lib/stations"
import { StationUrl } from "@/components/stationUrl";



export default async function Page() {
  const stations = await getStations();

  return (
    <>
      Select a station:
      <StationUrl stations={stations}/>
    </>
  );
}

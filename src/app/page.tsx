"use server";

import { getStations } from "@/lib/stations";
import { StationUrl } from "@/components/stationUrl";

export default async function Page() {
  try {
    const stations = await getStations();
    console.log("Loaded stations:", stations.length);

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

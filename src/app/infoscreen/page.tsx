"use server";

import { RenderStation } from "@/components/renderStation";
import { Station, getStations } from "@/lib/stations";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page(props: Props) {
  const searchParams = props.searchParams;
  const stationsParam = searchParams.stations as string;

  if (!stationsParam) {
    return (
      <div>No station provided.</div>
    );
  }

  let stations: string[] = stationsParam.split(",");

  if (stations.length == 0) {
    return (
      <div>No station provided.</div>
    );
  }

  const availableStations = await getStations();

  if (stations.some((station) => !availableStations.find((availableStation) => availableStation.id === station))) {
    return (
      <>
        <div>Invalid station provided.</div>
      </>
    );
  }

  const stationInfos = availableStations.filter((station) => stations.includes(station.id))!;

  return (
    <div className="w-full h-screen bg-blue-900 text-white p-5">
      {stationInfos.map((station, index) => (
        <div key={index} className="mb-5">
          <h1 className="text-2xl pb-2">{station.name}</h1>
          <div className="w-full rounded-md bg-blue-800 p-2">
            <RenderStation stationId={station.id} />
          </div>
        </div>
      ))}

    </div>
  );
}

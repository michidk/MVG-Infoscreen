"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type RenderStationProps = {
  stationId: string;
}

export function RenderStation(props: RenderStationProps) {
  const { stationId } = props;

  const [departures, setDepartures] = useState<any[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      const departuresResponse = await axios.get(`https://www.mvg.de/api/fib/v2/departure?globalId=${stationId}`);
      let departures = departuresResponse.data as Array<any>;
      departures = departures.sort((a, b) => a.realtimeDepartureTime - b.realtimeDepartureTime);

      // Filter out departures that are more than 10 minutes in the past
      const time = Date.now();
      departures = departures.filter((departure) => (departure.realtimeDepartureTime - time) / (1000 * 60) > -10);

      // Slice to get the first 10 entries
      departures = departures.slice(0, 10);

      setDepartures(departures);
    };

    fetchStations();

    const interval = setInterval(() => {
      fetchStations();
    }, 1000 * 3);

    return () => clearInterval(interval);
  }, [stationId]);

  return (
    <>
      <div>
        {departures.map((departure, index) => (
          <div key={index} className={(index % 2 == 0) ? "bg-blue-800" : "bg-blue-900"} >
            <table>
              <tr>
                <td>{formatVehicleIdentifier(departure.transportType, departure.label)}</td>
                <td>{departure.destination}</td>
                <td>{formatDepartureTime(departure.realtimeDepartureTime)}</td>
              </tr>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}

function formatDepartureTime(departureTime: number) {
  const now = Date.now();
  const timeUntilArrival = Math.round((departureTime - now) / (1000 * 60)); // Time in minutes

  const text = "Now";

  if (timeUntilArrival > 0) {
    return `${timeUntilArrival} min`;
  }

  return text;
}

function formatVehicleIdentifier(type: string, label: string) {
  // let color = "red";
  // switch (type) {
  //   case "SBAHN":
  //     color = ""
  // }
  return label;
}

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

      // Add a property to calculate time until arrival in minutes
      const currentTime = Date.now();
      departures = departures.map(departure => {
        const arrivalTimeInMinutes = Math.round((departure.realtimeDepartureTime - currentTime) / (60 * 1000));
        return { ...departure, timeUntilArrival: arrivalTimeInMinutes };
      });

      // departures.filter((departure) => departure.timeUntilArrival < -10); // Filter out departures that are more than 10 minutes in the past

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
          <div key={index}>
            <span>{departure.label}</span> -{" "}
            <span>{departure.destination}</span> -{" "}
            <span>{departure.timeUntilArrival}</span>
          </div>
        ))}
      </div>
    </>
  );
}

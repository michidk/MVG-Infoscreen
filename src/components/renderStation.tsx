"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";

type RenderStationProps = {
  stationId: string;
};

const ENTRIES = 8;
const REFRESH_INTERVAL = 1000 * 3; // 3 seconds

export function RenderStation(props: RenderStationProps) {
  const { stationId } = props;

  const [departures, setDepartures] = useState<any[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      const departuresResponse = await axios.get(
        `https://www.mvg.de/api/fib/v2/departure?globalId=${stationId}`,
      );
      let departures = departuresResponse.data as Array<any>;
      departures = departures.sort(
        (a, b) => a.realtimeDepartureTime - b.realtimeDepartureTime,
      );

      // Filter out departures that are more than 10 minutes in the past
      const time = Date.now();
      departures = departures.filter(
        (departure) =>
          (departure.realtimeDepartureTime - time) / (1000 * 60) > -10,
      );

      // Slice to get the first couple entries
      departures = departures.slice(0, ENTRIES);

      setDepartures(departures);
    };

    fetchStations();

    const interval = setInterval(() => {
      fetchStations();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [stationId]);

  return (
    <>
      <div>
        <Table>
          <TableBody>
            {departures.map((departure, index) => (
              <TableRow
                key={index}
                className={"text-4xl " + (index % 2 == 0 ? "" : "bg-blue-800")}
              >
                <TableCell className="p-0 px-4 py-2">
                  {formatVehicleIdentifier(
                    departure.transportType,
                    departure.label,
                  )}
                </TableCell>
                <TableCell className="p-0 px-4">
                  {departure.destination}
                </TableCell>
                <TableCell className="p-0 px-4">
                  {formatDepartureTime(departure.realtimeDepartureTime)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
  switch (type) {
    case "SBAHN": {
      let fgColor = "#ffffff";
      let bgColor = "#bdbdbd";
      switch (label) {
        case "S1":
          bgColor = "#0ebbe8";
          break;
        case "S2":
          bgColor = "#77b925";
          break;
        case "S3":
          bgColor = "#961582";
          break;
        case "S4":
          bgColor = "#e40014";
          break;
        case "S6":
          bgColor = "#018f58";
          break;
        case "S7":
          bgColor = "#8c2e22";
          break;
        case "S8":
          bgColor = "#000000";
          fgColor = "#f1b032";
          break;
      }
      return (
        <div
          className="rounded-full w-fit px-4"
          style={{ color: fgColor, backgroundColor: bgColor }}
        >
          {label}
        </div>
      );
    }
    case "UBAHN": {
      let bgColor = "#bdbdbd";
      switch (label) {
        case "U1":
          bgColor = "#52822f";
          break;
        case "U2":
          bgColor = "#c20831";
          break;
        case "U3":
          bgColor = "#ec6725";
          break;
        case "U4":
          bgColor = "#00a984";
          break;
        case "U5":
          bgColor = "#bc7a00";
          break;
        case "U6":
          bgColor = "#0065ae";
          break;
      }

      return (
        <div className="w-fit px-4" style={{ backgroundColor: bgColor }}>
          {label}
        </div>
      );
    }
    case "TRAM": {
      let bgColor = "#bdbdbd";
      switch (label) {
        case "16":
          bgColor = "#006bb1";
          break;
        case "12":
        case "17":
          bgColor = "#865b47";
          break;
        case "18":
          bgColor = "#2fa84e";
          break;
        case "19":
          bgColor = "#e52c29";
          break;
        case "22":
        case "20":
          bgColor = "#20b5db";
          break;
        case "21":
          bgColor = "#ba7911";
          break;
        case "23":
          bgColor = "#b3cc3b";
          break;
        case "15":
        case "25":
          bgColor = "#ef8e95";
          break;
        case "27":
        case "28":
          bgColor = "#f5a21e";
          break;
        case "19":
          bgColor = "#000000";
          break;
      }
      return (
        <div className="w-fit px-4" style={{ backgroundColor: bgColor }}>
          {label}
        </div>
      );
    }
    case "BUS": {
      return (
        <div className="w-fit px-4" style={{ backgroundColor: "#f99f1f" }}>
          {label}
        </div>
      );
    }
    default:
      return label;
  }
}

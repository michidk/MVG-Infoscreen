"use server";

import { fetchWithTimeout } from "@/lib/utils";

export async function getDepartures(stationId: string, entries: number): Promise<any[]> {
	const response = await fetchWithTimeout(
    `https://www.mvg.de/api/fib/v2/departure?globalId=${stationId}`,
		{},
		10 * 1000,
	);
  if (response.status !== 200) {
    throw new Error("Could not get departures");
  }
  let departures = (await response.json()) as Array<any>;

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
  departures = departures.slice(0, entries);
  return departures;
}

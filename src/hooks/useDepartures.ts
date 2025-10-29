"use client";

import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getRecentDepartures } from "@/app/infoscreen/actions";
import type { Departure } from "@/lib/departures";

export interface UseDeparturesOptions {
	/** The station ID to fetch departures for */
	stationId: string;
	/** Number of departure entries to fetch (default: 8) */
	entries?: number;
	/** Enable/disable auto-refetching (default: true) */
	enabled?: boolean;
	/** Custom refetch interval in milliseconds (default: from QueryClient config) */
	refetchInterval?: number;
}

export interface UseDeparturesReturn
	extends Omit<UseQueryResult<Departure[], Error>, "data"> {
	/** Array of departures, defaults to empty array if no data */
	departures: Departure[];
	/** Whether the query is currently loading for the first time */
	isLoading: boolean;
	/** Whether the query encountered an error */
	isError: boolean;
	/** Whether the query is currently refetching in the background */
	isRefetching: boolean;
}

/**
 * Custom hook for fetching departure data for a specific station.
 *
 * Features:
 * - Automatic refetching every 15 seconds (configurable)
 * - Smart caching per station
 * - Loading and error state management
 * - Type-safe return values
 *
 * @example
 * ```tsx
 * const { departures, isLoading, isError } = useDepartures({
 *   stationId: "de:09162:70",
 *   entries: 8
 * });
 * ```
 */
export function useDepartures(
	options: UseDeparturesOptions,
): UseDeparturesReturn {
	const { stationId, entries = 8, enabled = true, refetchInterval } = options;

	const query = useQuery({
		queryKey: ["departures", stationId, entries],
		queryFn: async () => {
			try {
				return await getRecentDepartures(stationId, entries);
			} catch (e) {
				const error = e as { code?: string; message: string };
				if (error.code === "ECONNABORTED") {
					console.error(
						`[useDepartures] Request timed out for station ${stationId}`,
					);
					throw new Error("Request timed out. Please try again.");
				}
				console.error(
					`[useDepartures] Error fetching departures for station ${stationId}:`,
					error.message,
				);
				throw new Error(
					error.message || "Failed to fetch departures. Please try again.",
				);
			}
		},
		enabled,
		refetchInterval,
		// Ensure we always have data in the background for smooth updates
		refetchIntervalInBackground: true,
		// Keep previous data while fetching new data to prevent flickering
		placeholderData: (previousData) => previousData,
	});

	return {
		...query,
		departures: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
		isRefetching: query.isRefetching,
	};
}

"use client";

import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getStations } from "@/app/actions";
import type { BasicStationInfo } from "@/lib/stations";

export interface UseStationsOptions {
	/** Enable/disable the query (default: true) */
	enabled?: boolean;
}

export interface UseStationsReturn
	extends Omit<UseQueryResult<BasicStationInfo[], Error>, "data"> {
	/** Array of stations, defaults to empty array if no data */
	stations: BasicStationInfo[];
	/** Whether the query is currently loading for the first time */
	isLoading: boolean;
	/** Whether the query encountered an error */
	isError: boolean;
}

/**
 * Custom hook for fetching all MVG stations.
 *
 * Features:
 * - Aggressive caching (5 minutes stale time) since station data rarely changes
 * - Automatic error handling
 * - Type-safe return values
 *
 * @example
 * ```tsx
 * const { stations, isLoading, isError } = useStations();
 * ```
 */
export function useStations(
	options: UseStationsOptions = {},
): UseStationsReturn {
	const { enabled = true } = options;

	const query = useQuery({
		queryKey: ["stations"],
		queryFn: async () => {
			try {
				return await getStations();
			} catch (e) {
				const error = e as { message: string };
				console.error("[useStations] Error fetching stations:", error.message);
				throw new Error(
					error.message || "Failed to fetch stations. Please try again.",
				);
			}
		},
		enabled,
		// Station data rarely changes, so cache it for longer
		staleTime: 5 * 60 * 1000, // 5 minutes
		// Keep the cache for even longer before garbage collection
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		...query,
		stations: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
	};
}

"use server";

import type { BasicStationInfo } from "@/lib/stations";
import { getStations as getStationsLib } from "@/lib/stations";

/**
 * Server action to fetch all available MVG stations.
 * This wraps the getStations function to make it callable from client components.
 */
export async function getStations(): Promise<BasicStationInfo[]> {
	return getStationsLib();
}

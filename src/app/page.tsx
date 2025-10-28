"use server";

import { StationUrl } from "@/components/stationUrl";
import { type BasicStationInfo, getStations } from "@/lib/stations";

export default async function Page() {
	try {
		const stations: BasicStationInfo[] = await getStations();

		return (
			<div className="container mx-auto px-4 py-8 min-h-screen">
				<div className="flex flex-col items-center space-y-8">
					<div className="text-center space-y-2">
						<h1 className="text-4xl font-bold tracking-tight">
							MVG Infoscreen
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl">
							Create your personalized Munich public transport departure board
						</p>
					</div>
					<StationUrl stations={stations} />
				</div>
			</div>
		);
	} catch (e) {
		const error = e as { message: string };
		return (
			<div className="container mx-auto px-4 py-8 min-h-screen">
				<div className="flex flex-col items-center space-y-4">
					<div className="text-center space-y-2">
						<h1 className="text-4xl font-bold tracking-tight text-destructive">
							Error Loading Stations
						</h1>
						<p className="text-muted-foreground">
							We couldn't load the station data. Please try again later.
						</p>
						<div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
							<p className="text-sm font-mono text-destructive">
								{error.message}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

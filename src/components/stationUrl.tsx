"use client";

import { StationSelect } from "@/components/stationsSelect";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/config";
import type { Station } from "@/lib/stations";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

type Props = {
	stations: Station[];
};

export function StationUrl(props: Props) {
	const { stations } = props;

	const [selectedStations, setSelectedStations] = useState<Station[]>([]);

	const url = `${siteConfig.url}/infoscreen?stations=${selectedStations.map(
		(station) => station.id,
	)}`;
	const active = selectedStations.length > 0;

	return (
		<>
			<StationSelect
				availableStations={stations}
				selectedStations={selectedStations}
				onSelect={(selectedStation) => {
					if (
						selectedStations.find(
							(station) => station.id === selectedStation.id,
						)
					) {
						setSelectedStations(
							selectedStations.filter(
								(station) => station.id !== selectedStation.id,
							),
						);
					} else {
						setSelectedStations([...selectedStations, selectedStation]);
					}
				}}
			/>
			<div className="flex space-x-2">
				<Input
					value={active ? url : ""}
					readOnly
					disabled={!selectedStations}
				/>
				<Button
					variant="secondary"
					className="shrink-0"
					disabled={!active}
					onClick={() => navigator.clipboard.writeText(url)}
				>
					Copy
				</Button>
				<Link
					href={url}
					className={cn(
						buttonVariants({ variant: "outline" }),
						!active && "pointer-events-none opacity-50",
					)}
				>
					Open
				</Link>
			</div>
		</>
	);
}

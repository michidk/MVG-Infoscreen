"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Station } from "@/lib/stations";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
	availableStations: Station[];
	selectedStations: Station[];
	onSelect: (station: Station) => void;
};

export function StationSelect(props: Props): React.JSX.Element {
	const maxStationsInitialLoad: number = 500;
	const {
		availableStations,
		selectedStations,
		onSelect,
	}: {
		availableStations: Array<Station>;
		selectedStations: Station[];
		onSelect: (station: Station) => void;
	} = props;
	const [open, setOpen]: [
		open: boolean,
		setOpen: React.Dispatch<React.SetStateAction<boolean>>,
	] = useState(false);
	const [allStationsLoaded, setAllStationsLoaded]: [
		allStationsLoaded: boolean,
		setAllStationsLoaded: React.Dispatch<boolean>,
	] = useState(false);
	const [stations, setStations]: [
		stations: Array<Station>,
		setStation: React.Dispatch<React.SetStateAction<Array<Station>>>,
	] = useState(availableStations.slice(0, maxStationsInitialLoad));

	//runs everytime the dropdown is opened
	React.useEffect((): void => {
		if (!availableStations) return;
		setAllStationsLoaded(false);
		setStations(availableStations.slice(0, maxStationsInitialLoad));
	}, [availableStations]);

	let boxLabel: string;
	if (selectedStations.length === 0) {
		boxLabel = "Select station...";
	} else if (selectedStations.length === 1) {
		boxLabel = selectedStations[0].name;
	} else {
		boxLabel = "...";
	}

	return (
		<>
			<>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-[200px] justify-between"
						>
							{boxLabel}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandInput placeholder="Search station..." />
							<ScrollArea className="h-96">
								{allStationsLoaded ? (
									<></>
								) : (
									<Button
										variant="outline"
										className="w-full justify-center"
										onClick={() => {
											setStations(availableStations);
											setAllStationsLoaded(true);
										}}
									>
										Load All Stations...
									</Button>
								)}
								<CommandEmpty>No station found.</CommandEmpty>
								<CommandGroup>
									{stations.map((station: Station) => (
										<CommandItem
											key={station.id}
											value={station.name}
											onSelect={(currentValue: string): void => {
												const selectedStation: Station | undefined =
													availableStations
														? availableStations.find(
																(station: Station): boolean =>
																	station.name.toLowerCase() === currentValue,
														  )
														: undefined;

												setOpen(false);
												setAllStationsLoaded(false);
												if (selectedStation) onSelect(selectedStation);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedStations.find(
														(selected: Station): boolean =>
															selected.id === station.id,
													)
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											{station.name}
										</CommandItem>
									))}
								</CommandGroup>
							</ScrollArea>
						</Command>
					</PopoverContent>
				</Popover>
			</>
		</>
	);
}

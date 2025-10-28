"use client";

import { TransportBadges } from "@/components/transportBadges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BasicStationInfo } from "@/lib/stations";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
	availableStations: BasicStationInfo[];
	selectedStations: BasicStationInfo[];
	onSelect: (station: BasicStationInfo) => void;
};

export function StationSelect(props: Props) {
	const { availableStations, selectedStations, onSelect } = props;
	const [searchQuery, setSearchQuery] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	// Filter stations based on search query
	const filteredStations = useMemo(() => {
		if (!searchQuery.trim()) {
			// When no search query, show only first 50 stations
			return availableStations.slice(0, 50);
		}

		const query = searchQuery.toLowerCase();
		const results = availableStations.filter((station) =>
			station.name.toLowerCase().includes(query),
		);

		// Limit to 100 results for performance
		return results.slice(0, 100);
	}, [searchQuery, availableStations]);

	const showResults = isFocused && searchQuery.trim().length > 0;
	const hasResults = filteredStations.length > 0;

	const isSelected = (stationId: string) => {
		return selectedStations.some((station) => station.id === stationId);
	};

	return (
		<div className="relative w-full">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search for a station... (e.g., Marienplatz, Hauptbahnhof)"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						// Delay to allow click on results
						setTimeout(() => setIsFocused(false), 200);
					}}
					className="pl-10"
				/>
			</div>

			{/* Search Results Dropdown */}
			{showResults && (
				<div className="absolute z-50 w-full mt-2 bg-popover border rounded-lg shadow-lg">
					{hasResults ? (
						<ScrollArea className="h-[300px]">
							<div className="p-2 space-y-1">
								{filteredStations.map((station) => (
									<Button
										key={station.id}
										variant="ghost"
										className="w-full justify-start text-left font-normal h-auto py-2 px-3"
										onClick={() => {
											onSelect(station);
											setSearchQuery("");
										}}
									>
										<div className="flex items-center w-full gap-3">
											<div
												className={`flex items-center justify-center w-4 h-4 shrink-0 border rounded-full ${
													isSelected(station.id)
														? "bg-primary border-primary"
														: "border-input"
												}`}
											>
												{isSelected(station.id) && (
													<Check className="h-3 w-3 text-primary-foreground" />
												)}
											</div>
											<span className="flex-1 text-left">{station.name}</span>
											<TransportBadges products={station.products} size="sm" />
										</div>
									</Button>
								))}
							</div>
						</ScrollArea>
					) : (
						<div className="p-4 text-center text-sm text-muted-foreground">
							No stations found matching "{searchQuery}"
						</div>
					)}

					{hasResults && filteredStations.length === 100 && (
						<div className="p-2 text-xs text-center text-muted-foreground border-t bg-muted/30">
							Showing first 100 results. Refine your search for more specific
							results.
						</div>
					)}
				</div>
			)}

			{/* Helper text */}
			<p className="mt-2 text-xs text-muted-foreground">
				{availableStations.length.toLocaleString()} stations available. Start
				typing to search.
			</p>
		</div>
	);
}

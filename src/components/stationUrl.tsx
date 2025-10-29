"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	CheckCircle2,
	Copy,
	ExternalLink,
	GripVertical,
	QrCode,
	Trash2,
	X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getRecentDepartures } from "@/app/infoscreen/actions";
import { StationSelect } from "@/components/stationsSelect";
import { TransportBadges } from "@/components/transportBadges";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/config";
import type { BasicStationInfo } from "@/lib/stations";

type Props = {
	stations: BasicStationInfo[];
};

type SortableStationItemProps = {
	station: BasicStationInfo;
	onRemove: (stationId: string) => void;
};

function SortableStationItem({ station, onRemove }: SortableStationItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: station.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-3 p-3 bg-background rounded-md border hover:border-primary/50 transition-colors ${
				isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab"
			}`}
		>
			<div
				{...attributes}
				{...listeners}
				className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
			>
				<GripVertical className="h-5 w-5" />
			</div>
			<div className="flex items-center gap-3 flex-1 min-w-0">
				<span className="font-medium truncate">{station.name}</span>
				<TransportBadges products={station.products} size="sm" />
			</div>
			<button
				type="button"
				onClick={() => onRemove(station.id)}
				className="shrink-0 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
				aria-label={`Remove ${station.name}`}
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}

export function StationUrl(props: Props) {
	const { stations } = props;
	const queryClient = useQueryClient();

	const [selectedStations, setSelectedStations] = useState<BasicStationInfo[]>(
		[],
	);
	const [copied, setCopied] = useState(false);
	const [showQR, setShowQR] = useState(false);
	const [qrCodeUrl, setQrCodeUrl] = useState("");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const url = `${siteConfig.url}/infoscreen?stations=${selectedStations.map((station) => station.id).join(",")}`;
	const active = selectedStations.length > 0;

	// Generate QR code using an API
	useEffect(() => {
		if (active) {
			setQrCodeUrl(
				`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`,
			);
		}
	}, [url, active]);

	// Prefetch departure data for selected stations
	// This makes the infoscreen load instantly when opened
	useEffect(() => {
		const ENTRIES = 8; // Must match the value in RenderStation

		// Prefetch data for all selected stations
		for (const station of selectedStations) {
			queryClient.prefetchQuery({
				queryKey: ["departures", station.id, ENTRIES],
				queryFn: async () => {
					return await getRecentDepartures(station.id, ENTRIES);
				},
			});
		}
	}, [selectedStations, queryClient]);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleRemoveStation = (stationId: string) => {
		setSelectedStations(
			selectedStations.filter((station) => station.id !== stationId),
		);
	};

	const handleClearAll = () => {
		setSelectedStations([]);
	};

	const handleSelect = (selectedStation: BasicStationInfo) => {
		if (selectedStations.find((station) => station.id === selectedStation.id)) {
			handleRemoveStation(selectedStation.id);
		} else {
			setSelectedStations([...selectedStations, selectedStation]);
		}
	};

	const handleLoadExample = (stationIds: string[]) => {
		const exampleStations = stations.filter((station) =>
			stationIds.includes(station.id),
		);
		setSelectedStations(exampleStations);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setSelectedStations((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	return (
		<div className="space-y-6 w-full max-w-4xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>MVG Infoscreen URL Generator</CardTitle>
					<CardDescription>
						Select one or more stations to generate a custom infoscreen URL
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Station Selection */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="text-sm font-medium">Select Stations</div>
							{selectedStations.length > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleClearAll}
									className="h-8 text-xs"
								>
									<Trash2 className="h-3 w-3 mr-1" />
									Clear All
								</Button>
							)}
						</div>
						<StationSelect
							availableStations={stations}
							selectedStations={selectedStations}
							onSelect={handleSelect}
						/>
					</div>

					{/* Example Stations */}
					<div className="space-y-3">
						<div className="text-sm font-medium">Quick Examples</div>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									handleLoadExample(["de:09162:1450", "de:09162:1310"])
								}
							>
								Obersendling & Siemenswerke
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleLoadExample(["de:09162:40"])}
							>
								Goetheplatz
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									handleLoadExample([
										"de:09179:6170",
										"de:09179:6190",
										"de:09179:6180",
									])
								}
							>
								Puchheim, Eichenau, FFB
							</Button>
						</div>
					</div>

					{/* Selected Stations Display */}
					{selectedStations.length > 0 ? (
						<div className="space-y-3">
							<div className="text-sm font-medium">
								Selected Stations ({selectedStations.length})
							</div>
							<div className="space-y-2 p-4 bg-muted rounded-lg">
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragEnd={handleDragEnd}
								>
									<SortableContext
										items={selectedStations.map((station) => station.id)}
										strategy={verticalListSortingStrategy}
									>
										{selectedStations.map((station) => (
											<SortableStationItem
												key={station.id}
												station={station}
												onRemove={handleRemoveStation}
											/>
										))}
									</SortableContext>
								</DndContext>
							</div>
						</div>
					) : (
						<div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
							<p className="text-sm">
								No stations selected yet. Choose stations from the dropdown
								above.
							</p>
						</div>
					)}

					{/* URL Display */}
					{active && (
						<div className="space-y-3">
							<div className="text-sm font-medium">Generated URL</div>
							<div className="flex gap-2">
								<Input
									value={url}
									readOnly
									className="font-mono text-sm"
									onClick={(e) => e.currentTarget.select()}
								/>
								<Button
									variant="secondary"
									className="shrink-0"
									onClick={handleCopy}
									disabled={!active}
								>
									{copied ? (
										<>
											<CheckCircle2 className="h-4 w-4 mr-2" />
											Copied!
										</>
									) : (
										<>
											<Copy className="h-4 w-4 mr-2" />
											Copy
										</>
									)}
								</Button>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					{active && (
						<div className="flex gap-2">
							<Button
								variant="default"
								className="flex-1"
								onClick={() => window.open(url, "_blank")}
							>
								<ExternalLink className="h-4 w-4 mr-2" />
								Open Infoscreen
							</Button>
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => setShowQR(!showQR)}
							>
								<QrCode className="h-4 w-4 mr-2" />
								{showQR ? "Hide" : "Show"} QR Code
							</Button>
						</div>
					)}

					{/* QR Code Display */}
					{active && showQR && (
						<div className="flex flex-col items-center space-y-3 p-6 bg-muted rounded-lg">
							<p className="text-sm font-medium">Scan to open infoscreen</p>
							<div className="bg-white p-4 rounded-lg">
								<Image
									src={qrCodeUrl}
									alt="QR Code for infoscreen URL"
									width={256}
									height={256}
									className="w-64 h-64"
								/>
							</div>
							<p className="text-xs text-muted-foreground text-center max-w-md">
								Use your mobile device to scan this QR code and instantly access
								the infoscreen
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Info Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">How to use</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-muted-foreground">
					<ol className="list-decimal list-inside space-y-1">
						<li>Select one or more stations from the dropdown menu above</li>
						<li>
							The URL will be automatically generated as you select stations
						</li>
						<li>
							Copy the URL or scan the QR code to access your custom infoscreen
						</li>
						<li>
							The infoscreen will display real-time departure information for
							all selected stations
						</li>
					</ol>
				</CardContent>
			</Card>
		</div>
	);
}

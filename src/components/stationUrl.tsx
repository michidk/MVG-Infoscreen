"use client";

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
import {
	CheckCircle2,
	Copy,
	ExternalLink,
	QrCode,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
	stations: BasicStationInfo[];
};

export function StationUrl(props: Props) {
	const { stations } = props;

	const [selectedStations, setSelectedStations] = useState<BasicStationInfo[]>(
		[],
	);
	const [copied, setCopied] = useState(false);
	const [showQR, setShowQR] = useState(false);
	const [qrCodeUrl, setQrCodeUrl] = useState("");

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

					{/* Selected Stations Display */}
					{selectedStations.length > 0 ? (
						<div className="space-y-3">
							<div className="text-sm font-medium">
								Selected Stations ({selectedStations.length})
							</div>
							<div className="space-y-2 p-4 bg-muted rounded-lg">
								{selectedStations.map((station) => (
									<div
										key={station.id}
										className="flex items-center justify-between gap-3 p-3 bg-background rounded-md border hover:border-primary/50 transition-colors"
									>
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<span className="font-medium truncate">
												{station.name}
											</span>
											<TransportBadges products={station.products} size="sm" />
										</div>
										<button
											type="button"
											onClick={() => handleRemoveStation(station.id)}
											className="shrink-0 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
											aria-label={`Remove ${station.name}`}
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								))}
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
								<img
									src={qrCodeUrl}
									alt="QR Code for infoscreen URL"
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecentDepartures } from "@/app/infoscreen/actions";
import { Skeleton } from "./ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

type RenderStationProps = {
	stationId: string;
};

const ENTRIES = 8;
const SKELETON_IDS = Array.from({ length: ENTRIES }, (_, i) => `skeleton-${i}`);

export function RenderStation(props: RenderStationProps) {
	const { stationId } = props;

	const {
		data: departures = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["departures", stationId],
		queryFn: async () => {
			try {
				return await getRecentDepartures(stationId, ENTRIES);
			} catch (e) {
				const error = e as { code: string; message: string };
				if (error.code === "ECONNABORTED") {
					console.error("Request to `/departure` timed out");
				} else {
					console.error("An error occurred (`/departure`)", error.message);
				}
				throw e;
			}
		},
	});

	return (
		<Table className="overflow-hidden">
			<TableBody>
				{isLoading &&
					SKELETON_IDS.map((id, index) => (
						<TableRow
							key={id}
							className={`text-3xl ${index % 2 === 0 ? "" : "bg-blue-800"}`}
						>
							<TableCell className="p-0 px-4 py-2" colSpan={3}>
								<Skeleton className="h-8 w-full" />
							</TableCell>
						</TableRow>
					))}
				{isError && (
					<TableRow className="text-3xl">
						<TableCell className="p-0 px-4 py-2">
							Error loading departures
						</TableCell>
					</TableRow>
				)}
				{!isLoading && !isError && departures.length === 0 && (
					<TableRow className="text-3xl">
						<TableCell className="p-0 px-4 py-2">No departures</TableCell>
					</TableRow>
				)}
				{!isLoading &&
					!isError &&
					departures.length > 0 &&
					departures.map((departure, index) => (
						<TableRow
							key={departure.label}
							className={`text-3xl ${index % 2 === 0 ? "" : "bg-blue-800"}`}
						>
							<TableCell className="p-0 px-4 py-2">
								{formatVehicleIdentifier(
									departure.transportType,
									departure.label,
								)}
							</TableCell>
							<TableCell className="p-0 px-4">
								{departure.destination}
							</TableCell>
							<TableCell className="p-0 px-4">
								{formatDepartureTime(departure.realtimeDepartureTime)}
							</TableCell>
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
}

function formatDepartureTime(departureTime: number) {
	const now = Date.now();
	const timeUntilArrival = Math.round((departureTime - now) / (1000 * 60)); // Time in minutes

	const text = "Now";

	if (timeUntilArrival > 0) {
		return `${timeUntilArrival} min`;
	}

	return text;
}

function formatVehicleIdentifier(type: string, label: string) {
	switch (type) {
		case "SBAHN": {
			let fgColor = "#ffffff";
			let bgColor = "#bdbdbd";
			switch (label) {
				case "S1":
					bgColor = "#0ebbe8";
					break;
				case "S2":
					bgColor = "#77b925";
					break;
				case "S3":
					bgColor = "#961582";
					break;
				case "S4":
					bgColor = "#e40014";
					break;
				case "S6":
					bgColor = "#018f58";
					break;
				case "S7":
					bgColor = "#8c2e22";
					break;
				case "S8":
					bgColor = "#000000";
					fgColor = "#f1b032";
					break;
			}
			return (
				<div
					className="rounded-full w-fit px-4"
					style={{ color: fgColor, backgroundColor: bgColor }}
				>
					{label}
				</div>
			);
		}
		case "UBAHN": {
			let bgColor = "#bdbdbd";
			const fgColor = "#ffffff";
			switch (label) {
				case "U1":
					bgColor = "#52822f";
					break;
				case "U2":
					bgColor = "#c20831";
					break;
				case "U3":
					bgColor = "#ec6725";
					break;
				case "U4":
					bgColor = "#00a984";
					break;
				case "U5":
					bgColor = "#bc7a00";
					break;
				case "U6":
					bgColor = "#0065ae";
					break;
			}

			return (
				<div
					className="rounded-full w-fit px-4"
					style={{ backgroundColor: bgColor, color: fgColor }}
				>
					{label}
				</div>
			);
		}
		case "TRAM": {
			let bgColor = "#bdbdbd";
			const fgColor = "#ffffff";
			switch (label) {
				case "16":
					bgColor = "#006bb1";
					break;
				case "12":
				case "17":
					bgColor = "#865b47";
					break;
				case "18":
					bgColor = "#2fa84e";
					break;
				case "19":
					bgColor = "#e52c29";
					break;
				case "22":
				case "20":
					bgColor = "#20b5db";
					break;
				case "21":
					bgColor = "#ba7911";
					break;
				case "23":
					bgColor = "#b3cc3b";
					break;
				case "15":
				case "25":
					bgColor = "#ef8e95";
					break;
				case "27":
				case "28":
					bgColor = "#f5a21e";
					break;
			}
			return (
				<div
					className="rounded-full w-fit px-4"
					style={{ backgroundColor: bgColor, color: fgColor }}
				>
					{label}
				</div>
			);
		}
		case "BUS":
		case "REGIONAL_BUS": {
			return (
				<div
					className="rounded-full w-fit px-4"
					style={{ backgroundColor: "#f99f1f", color: "#ffffff" }}
				>
					{label}
				</div>
			);
		}
		default:
			return label;
	}
}

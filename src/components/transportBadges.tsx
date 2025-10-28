import { Badge } from "@/components/ui/badge";
import { Bus, Train, Tram } from "lucide-react";

type Props = {
	products: string[];
	size?: "sm" | "md";
};

const TRANSPORT_TYPES = {
	UBAHN: {
		label: "U",
		color: "bg-blue-600 text-white border-blue-600",
		icon: Train,
	},
	SBAHN: {
		label: "S",
		color: "bg-green-700 text-white border-green-700",
		icon: Train,
	},
	TRAM: {
		label: "T",
		color: "bg-red-600 text-white border-red-600",
		icon: Tram,
	},
	BUS: {
		label: "B",
		color: "bg-purple-600 text-white border-purple-600",
		icon: Bus,
	},
	REGIONAL_BUS: {
		label: "RB",
		color: "bg-gray-600 text-white border-gray-600",
		icon: Train,
	},
} as const;

export function TransportBadges({ products, size = "sm" }: Props) {
	const sizeClasses =
		size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

	return (
		<div className="flex gap-1">
			{products.map((product) => {
				const transport =
					TRANSPORT_TYPES[product as keyof typeof TRANSPORT_TYPES];
				if (!transport) return null;

				const Icon = transport.icon;

				return (
					<Badge
						key={product}
						className={`${transport.color} ${sizeClasses} font-bold hover:opacity-90 transition-opacity`}
						variant="outline"
					>
						{size === "md" && <Icon className="h-3 w-3 mr-1" />}
						{transport.label}
					</Badge>
				);
			})}
		</div>
	);
}

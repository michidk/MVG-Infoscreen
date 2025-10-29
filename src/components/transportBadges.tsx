import { Badge } from "@/components/ui/badge";

type Props = {
	products: string[];
	size?: "sm" | "md";
};

const TRANSPORT_TYPES = {
	UBAHN: {
		label: "U",
		bgColor: "bg-blue-600",
	},
	SBAHN: {
		label: "S",
		bgColor: "bg-green-700",
	},
	TRAM: {
		label: "T",
		bgColor: "bg-orange-600",
	},
	BUS: {
		label: "B",
		bgColor: "bg-orange-500",
	},
	REGIONAL_BUS: {
		label: "X",
		bgColor: "bg-rose-600",
	},
} as const;

export function TransportBadges({ products, size = "sm" }: Props) {
	const sizeClasses = size === "sm" ? "text-[10px] w-5 h-5" : "text-xs w-6 h-6";
	const borderClass = size === "md" ? "border-white border" : "";

	return (
		<div className="flex gap-2">
			{products.map((product) => {
				const transport =
					TRANSPORT_TYPES[product as keyof typeof TRANSPORT_TYPES];
				if (!transport) return null;

				return (
					<Badge
						key={product}
						className={`${transport.bgColor} text-white ${borderClass} ${sizeClasses} font-bold hover:opacity-90 transition-opacity rounded-full p-0 flex items-center justify-center`}
						variant="outline"
					>
						{transport.label}
					</Badge>
				);
			})}
		</div>
	);
}

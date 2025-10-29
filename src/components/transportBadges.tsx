import { Badge } from "@/components/ui/badge";

type Props = {
	products: string[];
	size?: "sm" | "md";
};

const TRANSPORT_TYPES = {
	UBAHN: {
		label: "U",
		color: "bg-blue-600 text-white border-blue-600",
	},
	SBAHN: {
		label: "S",
		color: "bg-green-700 text-white border-green-700",
	},
	TRAM: {
		label: "T",
		color: "bg-orange-600 text-white border-orange-600",
	},
	BUS: {
		label: "B",
		color: "bg-orange-500 text-white border-orange-500",
	},
	REGIONAL_BUS: {
		label: "X",
		color: "bg-rose-600 text-white border-rose-600",
	},
} as const;

export function TransportBadges({ products, size = "sm" }: Props) {
	const sizeClasses = size === "sm" ? "text-[10px] w-5 h-5" : "text-xs w-6 h-6";

	return (
		<div className="flex gap-2">
			{products.map((product) => {
				const transport =
					TRANSPORT_TYPES[product as keyof typeof TRANSPORT_TYPES];
				if (!transport) return null;

				return (
					<Badge
						key={product}
						className={`${transport.color} ${sizeClasses} font-bold hover:opacity-90 transition-opacity rounded-full p-0 flex items-center justify-center`}
						variant="outline"
					>
						{transport.label}
					</Badge>
				);
			})}
		</div>
	);
}

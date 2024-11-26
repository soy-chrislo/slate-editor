import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarButtonProps {
	icon: LucideIcon;
	label: string;
	onClick: () => void;
	isActive?: boolean;
	disabled?: boolean;
}

export function ToolbarButton({
	icon: Icon,
	label,
	onClick,
	isActive,
	disabled,
}: ToolbarButtonProps) {
	return (
		<Tooltip delayDuration={300}>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					onClick={onClick}
					className={cn(
						"h-8 w-8",
						isActive && "bg-muted text-muted-foreground",
						"hover:bg-muted",
					)}
					disabled={disabled}
				>
					<Icon className="h-4 w-4" />
					<span className="sr-only">{label}</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">{label}</TooltipContent>
		</Tooltip>
	);
}

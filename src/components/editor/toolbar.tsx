"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import {
	Bold,
	Italic,
	RefreshCw,
	Strikethrough,
	Underline,
} from "lucide-react";
import {
	isBlockActive,
	isMarkActive,
	toggleBlock,
	toggleMark,
} from "./editorUtils";
import type { CustomEditor } from "./types";

interface ToolbarProps {
	editor: CustomEditor;
	onRefresh: () => void;
}

export const Toolbar = ({ editor, onRefresh }: ToolbarProps) => {
	const formatButtons = [
		{ format: "bold", icon: Bold, shortcut: "⌘+B" },
		{ format: "italic", icon: Italic, shortcut: "⌘+I" },
		{ format: "underline", icon: Underline, shortcut: "⌘+U" },
		{ format: "strikethrough", icon: Strikethrough, shortcut: "⌘+S" },
	] as const;

	const headingLevels = [1, 2, 3, 4, 5, 6] as const;

	return (
		<TooltipProvider>
			<div className="flex items-center gap-1 p-2 border-b">
				{formatButtons.map(({ format, icon: Icon, shortcut }) => (
					<Tooltip key={format}>
						<TooltipTrigger asChild>
							<Button
								variant={isMarkActive(editor, format) ? "secondary" : "ghost"}
								size="icon"
								onClick={() => toggleMark(editor, format)}
								className="w-8 h-8"
							>
								<Icon className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								{format.charAt(0).toUpperCase() + format.slice(1)} ({shortcut})
							</p>
						</TooltipContent>
					</Tooltip>
				))}

				<Separator orientation="vertical" className="mx-2 h-8" />

				{headingLevels.map((level) => (
					<Tooltip key={`h${level}`}>
						<TooltipTrigger asChild>
							<Button
								variant={
									isBlockActive(editor, "heading", level)
										? "secondary"
										: "ghost"
								}
								size="sm"
								onClick={() => toggleBlock(editor, "heading", level)}
								className="w-8 h-8 px-2"
							>
								H{level}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								Heading {level} (⌘+{level})
							</p>
						</TooltipContent>
					</Tooltip>
				))}

				<Separator orientation="vertical" className="mx-2 h-8" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							onClick={onRefresh}
							className="w-8 h-8"
						>
							<RefreshCw className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Refresh Preview</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
};

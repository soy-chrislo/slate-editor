import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { Editor } from "slate";
import { ToolbarButton } from "./toolbar-button";
import type { CustomEditor } from "./types";
import { useCallback } from "react";

interface ToolbarProps {
	editor: CustomEditor;
}

export function Toolbar({ editor }: ToolbarProps) {
	const toggleMark = useCallback(
		(format: string) => {
			if (!editor) return;
			const isActive = isMarkActive(editor, format);
			if (isActive) {
				Editor.removeMark(editor, format);
			} else {
				Editor.addMark(editor, format, true);
			}
		},
		[editor],
	);

	const isMarkActive = useCallback((editor: CustomEditor, format: string) => {
		const marks = Editor.marks(editor);
		return marks ? marks[format] === true : false;
	}, []);

	return (
		<div className="border-b p-1 flex gap-1">
			<ToolbarButton
				icon={Bold}
				label="Bold (⌘+B)"
				onClick={() => toggleMark("bold")}
				isActive={isMarkActive(editor, "bold")}
			/>
			<ToolbarButton
				icon={Italic}
				label="Italic (⌘+I)"
				onClick={() => toggleMark("italic")}
				isActive={isMarkActive(editor, "italic")}
			/>
			<ToolbarButton
				icon={Underline}
				label="Underline (⌘+U)"
				onClick={() => toggleMark("underline")}
				isActive={isMarkActive(editor, "underline")}
			/>
			<ToolbarButton
				icon={Strikethrough}
				label="Strikethrough (⌘+⇧+X)"
				onClick={() => toggleMark("strikethrough")}
				isActive={isMarkActive(editor, "strikethrough")}
			/>
		</div>
	);
}

"use client";

import { useCallback, useMemo, useState } from "react";
import { createEditor, type Descendant, Editor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import { Toolbar } from "./toolbar";
import { Leaf } from "./leaf";
import type { CustomEditor, CustomText } from "./types";
import { Button } from "@/components/ui/button";
import { FileJson, FileText } from "lucide-react";
import { serializeToHtml, serializeToMarkdown } from "@/lib/serializer";
import { toggleMark } from "./editorUtils";

const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+u": "underline",
	"mod+shift+x": "strikethrough",
} as const;

type HotkeyFormat = (typeof HOTKEYS)[keyof typeof HOTKEYS];

const initialValue: Descendant[] = [
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
];

export function RichTextEditor() {
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	const [html, setHtml] = useState<string>("");
	const [markdown, setMarkdown] = useState<string>("");

	const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

	const handleHotkeys = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			for (const hotkey in HOTKEYS) {
				if (isHotkey(hotkey, event.nativeEvent)) {
					event.preventDefault();
					const format = HOTKEYS[hotkey as keyof typeof HOTKEYS];
					toggleMark(editor, format);
				}
			}
		},
		[editor],
	);

	// const toggleMark = useCallback(
	// 	(editor: CustomEditor, format: HotkeyFormat) => {
	// 		const isActive = isMarkActive(editor, format);
	// 		if (isActive) {
	// 			Editor.removeMark(editor, format);
	// 		} else {
	// 			Editor.addMark(editor, format, true);
	// 		}
	// 	},
	// 	[],
	// );

	// const isMarkActive = useCallback(
	// 	(editor: CustomEditor, format: HotkeyFormat) => {
	// 		const marks = Editor.marks(editor);
	// 		return marks ? marks[format] === true : false;
	// 	},
	// 	[],
	// );

	const handleConvert = useCallback(() => {
		const htmlContent = serializeToHtml(editor.children);
		const markdownContent = serializeToMarkdown(editor.children);
		setHtml(htmlContent);
		setMarkdown(markdownContent);
	}, [editor.children]);

	return (
		<div className="space-y-4">
			<div className="min-h-[400px] rounded-md border bg-background">
				<Slate editor={editor} initialValue={initialValue}>
					<Toolbar editor={editor} />
					<Editable
						className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
						renderLeaf={renderLeaf}
						placeholder="Write your story..."
						spellCheck
						onKeyDown={handleHotkeys}
					/>
				</Slate>
			</div>

			<div className="flex gap-2">
				<Button onClick={handleConvert} className="gap-2">
					<FileJson className="h-4 w-4" />
					Convert Content
				</Button>
			</div>

			{(html || markdown) && (
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4" />
							<h2 className="text-lg font-semibold">HTML Output</h2>
						</div>
						<pre className="whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm">
							{html}
						</pre>
					</div>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4" />
							<h2 className="text-lg font-semibold">Markdown Output</h2>
						</div>
						<pre className="whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm">
							{markdown}
						</pre>
					</div>
				</div>
			)}
		</div>
	);
}

"use client";

import { Card } from "@/components/ui/card";
import isHotkey from "is-hotkey";
import { type KeyboardEvent, useCallback, useMemo, useState } from "react";
import {
	type Descendant,
	Editor,
	Element,
	Point,
	Transforms,
	createEditor,
} from "slate";
import { withHistory } from "slate-history";
import {
	Editable,
	type RenderElementProps,
	type RenderLeafProps,
	Slate,
	withReact,
} from "slate-react";
import { CodePreview } from "./code-preview";
import { toggleBlock, toggleMark } from "./editorUtils";
import { LivePreview } from "./live-preview";
import { Toolbar } from "./toolbar";
import type { CustomEditor, CustomElement } from "./types";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+u": "underline",
	"mod+s": "strikethrough",
	"mod+1": { type: "heading", level: 1 },
	"mod+2": { type: "heading", level: 2 },
	"mod+3": { type: "heading", level: 3 },
	"mod+4": { type: "heading", level: 4 },
	"mod+5": { type: "heading", level: 5 },
	"mod+6": { type: "heading", level: 6 },
} as const;

const initialValue: Descendant[] = [
	{
		type: "heading",
		level: 1,
		children: [{ text: "Heading Level 1" }],
	},
	{
		type: "heading",
		level: 2,
		children: [{ text: "Heading Level 2" }],
	},
	{
		type: "heading",
		level: 3,
		children: [{ text: "Heading Level 3" }],
	},
	{
		type: "heading",
		level: 4,
		children: [{ text: "Heading Level 4" }],
	},
	{
		type: "heading",
		level: 5,
		children: [{ text: "Heading Level 5" }],
	},
	{
		type: "heading",
		level: 6,
		children: [{ text: "Heading Level 6" }],
	},
	{
		type: "paragraph",
		children: [
			{ text: "This is a paragraph with " },
			{ text: "bold", bold: true },
			{ text: ", " },
			{ text: "italic", italic: true },
			{ text: ", " },
			{ text: "underline", underline: true },
			{ text: ", and " },
			{ text: "strikethrough", strikethrough: true },
			{ text: " styles." },
		],
	},
];

export const TextEditor = () => {
	const editor = useMemo(
		() => withEnterBreakOut(withHistory(withReact(createEditor()))),
		[],
	);
	const [refreshKey, setRefreshKey] = useState(0);

	const handleChange = useCallback((value: Descendant[]) => {
		setRefreshKey((prev) => prev + 1);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const entries = Object.entries(HOTKEYS) as [
				keyof typeof HOTKEYS,
				(typeof HOTKEYS)[keyof typeof HOTKEYS],
			][];

			for (const [hotkey, format] of entries) {
				if (isHotkey(hotkey, event)) {
					event.preventDefault();

					if (typeof format === "string") {
						toggleMark(editor, format);
					} else {
						toggleBlock(editor, format.type, format.level);
					}
				}
			}
		},
		[editor],
	);

	const renderElement = useCallback((props: RenderElementProps) => {
		switch (props.element.type) {
			case "heading": {
				const level = props.element.level as HeadingLevel;
				const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
				return <Tag {...props.attributes}>{props.children}</Tag>;
			}
			default:
				return <p {...props.attributes}>{props.children}</p>;
		}
	}, []);

	const renderLeaf = useCallback((props: RenderLeafProps) => {
		let children = props.children;
		if (props.leaf.bold) {
			children = <strong>{children}</strong>;
		}
		if (props.leaf.italic) {
			children = <em>{children}</em>;
		}
		if (props.leaf.underline) {
			children = <u>{children}</u>;
		}
		if (props.leaf.strikethrough) {
			children = <s>{children}</s>;
		}
		return <span {...props.attributes}>{children}</span>;
	}, []);

	return (
		<div className="container mx-auto p-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-4">
					<Card>
						<Slate
							editor={editor}
							initialValue={initialValue}
							onChange={handleChange}
						>
							<Toolbar editor={editor} />
							<div className="p-4">
								<Editable
									className="min-h-[400px] outline-none prose prose-sm max-w-none"
									placeholder="Start typing..."
									onKeyDown={handleKeyDown}
									renderElement={renderElement}
									renderLeaf={renderLeaf}
								/>
							</div>
						</Slate>
					</Card>
					<CodePreview key={refreshKey} value={editor.children} />
				</div>
				<div className="h-[600px]">
					<LivePreview value={editor.children} />
				</div>
			</div>
		</div>
	);
};

const withEnterBreakOut = (editor: CustomEditor) => {
	const { insertBreak } = editor;

	editor.insertBreak = () => {
		const [match] = Editor.nodes(editor, {
			match: (n) => Element.isElement(n) && n.type === "heading",
		});

		if (match) {
			const [node, path] = match;
			const end = Editor.end(editor, path);
			const selection = editor.selection;

			if (selection && Point.equals(selection.focus, end)) {
				Transforms.insertNodes(editor, {
					type: "paragraph",
					children: [{ text: "" }],
				} as CustomElement);
				return;
			}
		}

		insertBreak();
	};

	return editor;
};

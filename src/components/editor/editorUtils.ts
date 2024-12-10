import escapeHtml from "escape-html";
import { Editor, Element, Text, Transforms } from "slate";
import type { CustomEditor, CustomElement, HeadingLevel } from "./types";

export const isMarkActive = (
	editor: CustomEditor,
	format: keyof Omit<Text, "text">,
) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

export const toggleMark = (
	editor: CustomEditor,
	// format: keyof Omit<Text, "text">,
	format: "bold" | "italic" | "underline" | "strikethrough",
) => {
	const isActive = isMarkActive(editor, format);
	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

export const isBlockActive = (
	editor: CustomEditor,
	type: string,
	level?: HeadingLevel,
) => {
	const [match] = Editor.nodes(editor, {
		match: (n) =>
			Element.isElement(n) && n.type === type && (!level || n.level === level),
	});
	return !!match;
};

export const toggleBlock = (
	editor: CustomEditor,
	type: "paragraph" | "heading",
	// level?: HeadingLevel,
	level?: 1 | 2 | 3 | 4 | 5 | 6,
) => {
	const isActive = isBlockActive(editor, type, level);

	Transforms.setNodes(
		editor,
		{ type: isActive ? "paragraph" : type, level: level },
		{ match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) },
	);
};

export const serializeToHtml = (nodes: (CustomElement | Text)[]): string => {
	return nodes
		.map((node) => {
			if (Text.isText(node)) {
				let string = escapeHtml(node.text);
				if (node.bold) string = `<strong>${string}</strong>`;
				if (node.italic) string = `<em>${string}</em>`;
				if (node.underline) string = `<u>${string}</u>`;
				if (node.strikethrough) string = `<s>${string}</s>`;
				return string;
			}

			const children = node.children
				.map((n: CustomElement | Text) => serializeToHtml([n]))
				.join("");

			if (node.type === "heading") {
				return `<h${node.level}>${children}</h${node.level}>`;
			}

			return `<p>${children}</p>`;
		})
		.join("");
};

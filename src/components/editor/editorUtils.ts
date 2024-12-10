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
			if (node.type === "link") {
				return `
    <div style="margin: 0.5rem 0; padding: 0.5rem; border: 1px solid rgb(229, 231, 235); border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(107, 114, 128)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
      <a href="${node.url}" style="color: rgb(37, 99, 235); text-decoration: none; word-break: break-all; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${node.url}</a>
    </div>
  `;
			}
			if (node.type === "image") {
				return `
					<div style="margin: 1rem 0; display: flex; justify-content: center;">
						<img 
							src="${node.url}" 
							alt="${node.alt || ""}" 
							style="max-height: 500px; width: auto; object-fit: contain;"
						/>
					</div>
				`;
			}

			return `<p>${children}</p>`;
		})
		.join("");
};

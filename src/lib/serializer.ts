import type { CustomText } from "@/components/editor/types";
import { Editor, Node } from "slate";

export const serializeToHtml = (nodes: Node[]): string => {
	return nodes
		.map((node) => {
			if (Editor.isEditor(node)) {
				return serializeToHtml(node.children);
			}

			if (!Node.isNode(node) || !("children" in node)) {
				const text = node as CustomText;
				let string = text.text;
				if (text.bold) string = `<strong>${string}</strong>`;
				if (text.italic) string = `<em>${string}</em>`;
				if (text.underline) string = `<u>${string}</u>`;
				if (text.strikethrough) string = `<s>${string}</s>`;
				return string;
			}

			const children = serializeToHtml(node.children as Node[]);
			switch (node.type) {
				case "paragraph":
					return `<p>${children}</p>`;
				default:
					return children;
			}
		})
		.join("");
};

export const serializeToMarkdown = (nodes: Node[]): string => {
	return nodes
		.map((node) => {
			if (Editor.isEditor(node)) {
				return serializeToMarkdown(node.children);
			}

			if (!Node.isNode(node) || !("children" in node)) {
				const text = node as CustomText;
				let string = text.text;
				if (text.bold) string = `**${string}**`;
				if (text.italic) string = `*${string}*`;
				if (text.underline) string = `_${string}_`;
				if (text.strikethrough) string = `~~${string}~~`;
				return string;
			}

			const children = serializeToMarkdown(node.children as Node[]);
			switch (node.type) {
				case "paragraph":
					return `${children}\n\n`;
				default:
					return children;
			}
		})
		.join("");
};

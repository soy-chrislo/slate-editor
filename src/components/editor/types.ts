import type { BaseEditor } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type CustomElement = {
	type: "paragraph" | "heading" | "link" | "image";
	level?: HeadingLevel;
	url?: string;
	alt?: string;
	children: CustomText[];
};

export type CustomText = {
	text: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
};

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
	interface CustomTypes {
		Editor: CustomEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

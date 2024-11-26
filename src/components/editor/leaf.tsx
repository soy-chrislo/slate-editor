"use client";

import type { RenderLeafProps } from "slate-react";
import type { CustomText } from "./types";

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
	const text = leaf as CustomText;

	if (text.bold) {
		children = <strong>{children}</strong>;
	}

	if (text.italic) {
		children = <em>{children}</em>;
	}

	if (text.underline) {
		children = <u>{children}</u>;
	}

	if (text.strikethrough) {
		children = <s>{children}</s>;
	}

	return <span {...attributes}>{children}</span>;
}

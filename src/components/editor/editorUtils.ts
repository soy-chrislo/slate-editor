import { Editor } from "slate";
import type { CustomEditor } from "./types";

export const toggleMark = (editor: CustomEditor, format: string) => {
	const isActive = isMarkActive(editor, format);
	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

export const isMarkActive = (editor: CustomEditor, format: string) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

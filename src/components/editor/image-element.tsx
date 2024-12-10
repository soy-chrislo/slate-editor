import type { RenderElementProps } from "slate-react";

export const ImageElement = ({
	attributes,
	children,
	element,
}: RenderElementProps) => {
	return (
		<div {...attributes} className="my-4 flex justify-center">
			<div contentEditable={false} className="relative">
				<img
					src={element.url}
					alt={element.alt || ""}
					className="max-h-[500px] w-auto object-contain"
				/>
			</div>
			{children}
		</div>
	);
};

import { Link2 } from "lucide-react";
import type { RenderElementProps } from "slate-react";

export const LinkElement = ({
	attributes,
	children,
	element,
}: RenderElementProps) => {
	return (
		<div
			{...attributes}
			className="my-2 p-2 border border-gray-200 rounded-md flex items-center gap-2"
		>
			<Link2 className="h-4 w-4 text-gray-500" />
			<a
				href={element.url}
				className="text-blue-600 hover:underline break-all"
				contentEditable={false}
			>
				{element.url}
			</a>
			{children}
		</div>
	);
};

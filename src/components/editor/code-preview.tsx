"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serializeToHtml } from "./editorUtils";

interface CodePreviewProps {
	value: any[];
}

export const CodePreview = ({ value }: CodePreviewProps) => {
	const html = serializeToHtml(value);

	return (
		<Card>
			<Tabs defaultValue="html" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="html">HTML</TabsTrigger>
					<TabsTrigger value="json">JSON</TabsTrigger>
				</TabsList>
				<TabsContent value="html" className="p-4">
					<pre className="whitespace-pre-wrap font-mono text-sm">{html}</pre>
				</TabsContent>
				<TabsContent value="json" className="p-4">
					<pre className="whitespace-pre-wrap font-mono text-sm">
						{JSON.stringify(value, null, 2)}
					</pre>
				</TabsContent>
			</Tabs>
		</Card>
	);
};

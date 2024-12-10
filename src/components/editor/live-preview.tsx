"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { serializeToHtml } from "./editorUtils";

interface LivePreviewProps {
	value: any[];
}

export const LivePreview = ({ value }: LivePreviewProps) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const html = serializeToHtml(value);

	useEffect(() => {
		if (iframeRef.current) {
			const doc = iframeRef.current.contentDocument;
			if (doc) {
				doc.open();
				doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  line-height: 1.5;
                  padding: 1rem;
                  margin: 0;
                }
                * { max-width: 100%; }
              </style>
            </head>
            <body>${html}</body>
          </html>
        `);
				doc.close();
			}
		}
	}, [html]);

	return (
		<Card className="h-full">
			<div className="p-2 bg-muted text-sm font-medium border-b">
				Live Preview
			</div>
			<iframe
				ref={iframeRef}
				className="w-full h-[calc(100%-37px)] bg-white"
				title="Preview"
			/>
		</Card>
	);
};

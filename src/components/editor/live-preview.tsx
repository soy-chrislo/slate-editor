// src/components/editor/live-preview.tsx
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
                  margin: 0;
                  padding: 1rem;
                }
                * { max-width: 100%; }
              </style>
            </head>
            <body>${html}</body>
          </html>
        `);
				doc.close();

				// Ajustar altura del iframe al contenido
				const resizeObserver = new ResizeObserver(() => {
					if (iframeRef.current && doc.body) {
						iframeRef.current.style.height = `${doc.body.scrollHeight}px`;
					}
				});

				resizeObserver.observe(doc.body);

				return () => {
					resizeObserver.disconnect();
				};
			}
		}
	}, [html]);

	return (
		<Card>
			<div className="p-2 bg-muted text-sm font-medium border-b">
				Live Preview
			</div>
			<iframe
				ref={iframeRef}
				className="w-full bg-white"
				title="Preview"
				scrolling="no"
			/>
		</Card>
	);
};

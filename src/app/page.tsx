"use client";
import DocumentViewer from "@/components/DocumentViewer";

export default function ViewPage({
  params,
}: {
  params: { accessKey: string };
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <DocumentViewer accessKey={params.accessKey} />
    </main>
  );
}

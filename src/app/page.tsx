// src/app/view/[accessKey]/page.tsx
import DocumentViewer from "@/components/DocumentViewer";
import { Suspense } from "react";

interface PageProps {
  params: {
    accessKey: string;
  };
}

export default function ViewPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="animate-pulse p-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      }>
        <DocumentViewer accessKey={params.accessKey} />
      </Suspense>
    </main>
  );
}
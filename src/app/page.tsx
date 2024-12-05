// src/app/view/[accessKey]/page.tsx
import DocumentViewer from "@/components/DocumentViewer";
import { Suspense } from "react";

// Define props according to Next.js 13's page requirements
interface PageProps {
  params: {
    accessKey: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Make it async and use Suspense for loading states
export default async function ViewPage({
  params,
  searchParams,
}: PageProps) {
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

// Generate metadata for the page
export function generateMetadata({ params }: PageProps) {
  return {
    title: `Document Viewer - ${params.accessKey}`,
  };
}

// Optional: Add page generation config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
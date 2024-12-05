// src/app/view/[accessKey]/page.tsx
import DocumentViewer from "@/components/DocumentViewer";

interface PageProps {
  params: {
    accessKey: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ViewPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <DocumentViewer accessKey={params.accessKey} />
    </main>
  );
}
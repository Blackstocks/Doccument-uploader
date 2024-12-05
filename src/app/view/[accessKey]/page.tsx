"use client";
import DocumentViewer from '@/components/DocumentViewer';

type Props = {
  params: { accessKey: string };
};

export default function ViewPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-gray-50">
      <DocumentViewer accessKey={params.accessKey} />
    </main>
  );
}
"use client";
import { PageProps } from 'next/types';
import DocumentViewer from '@/components/DocumentViewer';

export default async function ViewPage({
  params,
}: PageProps<{ accessKey: string }>) {
  return (
    <main className="min-h-screen bg-gray-50">
      <DocumentViewer accessKey={params.accessKey} />
    </main>
  );
}
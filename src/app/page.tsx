// src/app/page.tsx
import FileUploader from '@/components/FileUploader';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-white">Document Sharing</h1>
            <p className="text-blue-100 mt-2">
              Share your documents securely with anyone. Supports PDF, DOC, and DOCX files.
            </p>
          </div>
          
          {/* Content */}
          <div className="p-6 md:p-8">
            <FileUploader />
          </div>
        </div>
      </div>
    </div>
  );
}
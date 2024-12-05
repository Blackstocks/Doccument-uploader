"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Document, Comment } from '@/types';

export default function DocumentViewer({ accessKey }: { accessKey: string }) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select()
          .eq('access_key', accessKey)
          .single();

        if (error) throw error;
        setDoc(data);
        setShareUrl(`${window.location.origin}/view/${accessKey}`);

        // Subscribe to realtime comments
        const channel = supabase
          .channel(`document_${accessKey}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'documents',
            filter: `access_key=eq.${accessKey}`
          }, (payload) => {
            setDoc(payload.new as Document);
          })
          .subscribe();

        return () => {
          channel.unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [accessKey]);

  const addComment = async () => {
    if (!newComment.trim() || !doc) return;

    setCommentLoading(true);
    try {
      const newCommentObj: Comment = {
        id: crypto.randomUUID(),
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
        author: 'Anonymous User'
      };

      const { error } = await supabase
        .from('documents')
        .update({
          comments: [...(doc.comments || []), newCommentObj]
        })
        .eq('access_key', accessKey);

      if (error) throw error;
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (!doc) return null;

  return (
    <div className="flex h-screen">
      {/* Main Document Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {doc.filename}
          </h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="text-sm px-3 py-2 border rounded bg-gray-50 text-gray-900 min-w-[300px]"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied!');
              }}
              className="text-sm px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {doc.filetype.includes('pdf') ? (
            <iframe
              src={doc.url}
              className="w-full h-full border-0"
              title="Document Preview"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <svg 
                  className="mx-auto h-16 w-16 text-gray-600 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <p className="text-xl font-medium text-gray-900 mb-4">
                  Preview not available for this file type
                </p>
                <a
                  href={doc.url}
                  download={doc.filename}
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Download File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Sidebar */}
      <div className="w-80 border-l bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Comments</h2>
        </div>
        
        {/* Comments List */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {doc.comments?.length === 0 && (
            <p className="text-center text-gray-600">No comments yet</p>
          )}
          {doc.comments?.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-900">
                  {comment.author}
                </span>
                <span className="text-xs text-gray-600">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="p-4 border-t bg-gray-50">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg text-gray-900 placeholder:text-gray-500 text-sm"
            rows={3}
          />
          <button
            onClick={addComment}
            disabled={commentLoading || !newComment.trim()}
            className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-sm font-medium"
          >
            {commentLoading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </div>
    </div>
  );
}


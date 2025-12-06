import React from 'react';
import { JobPost } from '../types';

interface ResultsFeedProps {
  results: JobPost[];
}

export const ResultsFeed: React.FC<ResultsFeedProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
        <span className="bg-green-100 text-green-900 p-2 rounded-lg border border-green-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </span>
        AI Found Results
      </h3>
      <div className="grid grid-cols-1 gap-5">
        {results.map((post, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h4 className="text-xl font-black text-gray-900 mb-1">{post.title}</h4>
                <p className="text-base text-gray-800 font-bold mb-3">{post.company}</p>
              </div>
              <span className="text-xs font-black uppercase tracking-wide px-3 py-1 bg-gray-200 text-gray-900 rounded-full">
                {post.source}
              </span>
            </div>
            
            {post.snippet && (
                <p className="text-base text-gray-700 mt-2 mb-5 line-clamp-3 leading-relaxed font-medium">
                    {post.snippet}
                </p>
            )}

            <a 
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-black text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
            >
                View Job Post
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
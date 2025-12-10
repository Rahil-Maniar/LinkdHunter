import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { DirectLinks } from './components/DirectLinks';
import { ResultsFeed } from './components/ResultsFeed';
import { SearchState, SearchResponse, JobPost } from './types';
import { searchJobs } from './services/gemini';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>({ role: '', location: '' });
  const [results, setResults] = useState<JobPost[]>([]);
  const [refinedKeywords, setRefinedKeywords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

 // Helper function for creating a delay
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSearch = async (state: SearchState) => {
    setIsLoading(true);
    setError(null);
    setSearchState(state);
    
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response: SearchResponse = await searchJobs(state.role, state.location);
        setResults(response.posts);
        setRefinedKeywords(response.refinedKeywords);
        setIsLoading(false); // Success, stop loading
        return; // Exit the function on success
      } catch (err: any) {
        console.error(`Attempt ${attempt + 1} failed:`, err);
        
        // IMPORTANT: Check if the error is specifically a rate limit error.
        // The check for `err.status === 429` assumes your `searchJobs` service
        // throws an error object with a `status` property. Adjust if necessary.
        if (err.status === 429 && attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s...
          
          // Update UI to inform the user
          setError(`Too many requests. Retrying in ${delay / 1000} seconds...`);
          
          await wait(delay);
          attempt++;
        } else {
          // For non-429 errors or if we've run out of retries, show the final error.
          setError("An error occurred while communicating with the AI. Please try again.");
          setIsLoading(false);
          return; // Exit the function on final failure
        }
      }
    }
    
    // This part is reached if all retries fail.
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-800 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
             </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-none">LinkdHunter</h1>
            <p className="text-sm text-gray-600 font-bold mt-1">Smart Job Search Assistant</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Find your next opportunity
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Enter your desired role and location. We'll use AI to find hidden jobs, generate optimized search keywords, and help you check <strong>ATS & Job Portals</strong> directly.
          </p>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {error && (
            <div className="bg-red-50 text-red-900 p-5 rounded-lg mb-8 border-2 border-red-200 flex items-center gap-3 font-bold text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
            </div>
        )}

        {/* Action Section */}
        {!isLoading && (results.length > 0 || refinedKeywords.length > 0) && (
            <div className="animate-fade-in-up">
                {/* 1. Direct Links (The "Go to LinkedIn Searchbar" logic + Hacks) */}
                <DirectLinks keywords={refinedKeywords} location={searchState.location} />
                
                {/* 2. AI Found Results (The "Return Results" logic) */}
                <ResultsFeed results={results} />
            </div>
        )}

        {/* Empty State / Initial Instructions */}
        {!isLoading && results.length === 0 && refinedKeywords.length === 0 && !error && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-700">
                <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="w-14 h-14 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-200">
                        <span className="font-black text-xl">1</span>
                    </div>
                    <p className="text-base font-bold">Enter "Javascript Engineer"</p>
                    <p className="text-sm mt-2 text-gray-600">We analyze your title.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                     <div className="w-14 h-14 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-200">
                        <span className="font-black text-xl">2</span>
                    </div>
                    <p className="text-base font-bold">We Strip the Title</p>
                    <p className="text-sm mt-2 text-gray-600">Searching "Javascript" finds more jobs than "Javascript Engineer".</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                     <div className="w-14 h-14 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-200">
                        <span className="font-black text-xl">3</span>
                    </div>
                    <p className="text-base font-bold">Deep Search Hacks</p>
                    <p className="text-sm mt-2 text-gray-600">We give you direct links to ATS systems & Job Portals.</p>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
import React, { useState, useEffect, useRef } from 'react';
import { SearchState } from '../types';

interface SearchFormProps {
  onSearch: (search: SearchState) => void;
  isLoading: boolean;
}

const POPULAR_LOCATIONS = [
  "Remote", "New York, NY", "San Francisco, CA", "London, UK", 
  "Bangalore, India", "Ahmedabad, India", "Pune, India", "Mumbai, India", "Delhi, India",
  "Toronto, Canada", "Berlin, Germany", "Singapore", "Sydney, Australia", "Austin, TX", "Seattle, WA"
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Ahmedabad');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role.trim()) {
      setShowSuggestions(false);
      onSearch({ role, location });
    }
  };

  const filteredLocations = POPULAR_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(location.toLowerCase()) && loc !== location
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-300 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="role" className="block text-base font-black text-gray-900 mb-2">
            Job Title / Keywords
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. AI or ML Engineer"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors font-semibold text-lg"
            required
          />
        </div>
        <div className="relative">
          <label htmlFor="location" className="block text-base font-black text-gray-900 mb-2">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => {
                setLocation(e.target.value);
                setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="e.g. Ahmedabad"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors font-semibold text-lg"
          />
          {showSuggestions && filteredLocations.length > 0 && (
            <div ref={suggestionRef} className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto">
              {filteredLocations.map((loc) => (
                <div
                  key={loc}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 font-medium"
                  onClick={() => {
                    setLocation(loc);
                    setShowSuggestions(false);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg font-black text-white text-lg transition-all shadow-md transform
            ${isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-800 hover:bg-blue-900 hover:shadow-xl active:scale-95'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Hunting...
            </span>
          ) : (
            'Find Jobs'
          )}
        </button>
      </div>
    </form>
  );
};
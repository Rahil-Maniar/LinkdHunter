import React from 'react';

interface DirectLinksProps {
  keywords: string[];
  location: string;
}

const ATS_GROUPS = [
  {
    id: 'tech',
    label: "Tech & Startups",
    description: "Greenhouse, Lever, Ashby, Workable, Breezy",
    sites: [
      "site:greenhouse.io",
      "site:lever.co",
      "site:ashbyhq.com",
      "site:workable.com",
      "site:breezy.hr"
    ]
  },
  {
    id: 'india',
    label: "Indian Top Job Portals",
    description: "Naukri, Instahyre, Hirist, Cutshort, Foundit",
    sites: [
      "site:naukri.com",
      "site:instahyre.com",
      "site:hirist.com",
      "site:cutshort.io",
      "site:foundit.in"
    ]
  },
  {
    id: 'enterprise',
    label: "Enterprise & Corporate",
    description: "Workday, iCIMS, SmartRecruiters, BambooHR, Jobvite",
    sites: [
      "site:myworkdayjobs.com",
      "site:icims.com",
      "site:smartrecruiters.com",
      "site:jobvite.com",
      "site:bamboohr.com"
    ]
  },
  {
    id: 'other',
    label: "Global & Emerging",
    description: "TeamTailor, Personio, Recruitee, ApplyToJob, Careers-Page",
    sites: [
      "site:recruitee.com",
      "site:applytojob.com",
      "site:careers-page.com",
      "site:teamtailor.com",
      "site:jobs.personio.com"
    ]
  }
];

export const DirectLinks: React.FC<DirectLinksProps> = ({ keywords, location }) => {
  if (keywords.length === 0) return null;

  const generateLinkedInUrl = (keyword: string) => {
    const query = `#hiring ${keyword} ${location}`;
    const encodedQuery = encodeURIComponent(query);
    return `https://www.linkedin.com/search/results/content/?keywords=${encodedQuery}&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22`;
  };

  const generateAtsSearchUrl = (sites: string[], timeFilter: 'd' | 'w') => {
    const sitesString = `(${sites.join(' OR ')})`;
    // Take top 3 keywords max to prevent query overflow since we have multiple sites
    const safeKeywords = keywords.slice(0, 3); 
    const keywordsOr = `(${safeKeywords.join(' OR ')})`;
    
    // Construct query: (site:A OR site:B) (Key1 OR Key2) "Location"
    const query = `${sitesString} ${keywordsOr} "${location}"`;
    
    // tbs=qdr:d (day) or qdr:w (week)
    return `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=qdr:${timeFilter}`;
  };

  return (
    <div className="space-y-6 mb-8">
        
      {/* LinkedIn Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-800" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn Search Hacks
        </h3>
        <p className="text-sm text-gray-600 font-medium mb-4">
            Directly search LinkedIn for <strong>#hiring</strong> posts. These bypass job boards and find posts by recruiters.
        </p>
        <div className="flex flex-wrap gap-3">
            {keywords.map((keyword, idx) => (
            <a
                key={idx}
                href={generateLinkedInUrl(keyword)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-400 hover:text-blue-950 transition-all font-bold text-sm"
            >
                <span>#hiring {keyword}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
            ))}
        </div>
      </div>

      {/* External ATS Hacks */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-purple-200">
        <h3 className="text-xl font-black text-purple-900 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Hidden ATS & Portals
        </h3>
        <p className="text-sm text-gray-600 font-medium mb-5">
            We split the search into groups to prevent Google from blocking long queries. <br/>
            <span className="text-orange-700 italic">"Past Week" is recommended as Google takes time to index new pages.</span>
        </p>
        
        <div className="grid grid-cols-1 gap-4">
            {ATS_GROUPS.map((group) => (
                <div key={group.id} className="border border-purple-100 bg-purple-50/50 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h4 className="text-lg font-bold text-purple-900">{group.label}</h4>
                        <p className="text-xs text-gray-600 font-medium mt-1">{group.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={generateAtsSearchUrl(group.sites, 'w')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 whitespace-nowrap inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 hover:shadow-md transition-all font-bold text-sm shadow-sm"
                        >
                            <span>Search (Week)</span>
                        </a>
                        <a
                            href={generateAtsSearchUrl(group.sites, 'd')}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Search Past 24 Hours"
                            className="inline-flex whitespace-nowrap items-center justify-center gap-1 px-3 py-2 bg-white text-purple-900 border border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all font-bold text-sm"
                        >
                            <span>24h</span>
                        </a>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};
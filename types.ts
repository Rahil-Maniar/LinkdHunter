export interface JobPost {
  title: string;
  company: string;
  snippet: string;
  url: string;
  source: string;
  date?: string;
}

export interface SearchState {
  role: string;
  location: string;
}

export interface RefinedKeyword {
  keyword: string;
  url: string;
}

export interface SearchResponse {
  posts: JobPost[];
  refinedKeywords: string[];
}

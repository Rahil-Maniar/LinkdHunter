import { GoogleGenAI } from "@google/genai";
import { SearchResponse, JobPost } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchJobs = async (role: string, location: string): Promise<SearchResponse> => {
  const model = "gemini-2.5-flash"; 
  
  // Updated prompt to try and find more results by being broader in the internal search
  const prompt = `
    I am looking for a job with the title "${role}" in "${location}".
    
    Task 1: Use Google Search to find actual, recent public LinkedIn posts or job listings.
    Search for things like: 
    - site:linkedin.com/posts "#hiring" "${role}" "${location}"
    - site:linkedin.com/jobs "${role}" "${location}"
    - "${role}" jobs in "${location}" hiring now
    
    Task 2: Analyze the user's input "${role}" and generate a list of 4-6 optimized, short keywords for searching LinkedIn posts.
    CRITICAL RULES for keywords:
    1. EXTRACT CORE SKILLS: If user says "Javascript Engineer", output ["Javascript", "JS", "TypeScript"]. 
    2. STRIP TITLES COMPLETELY: Remove generic words like "Engineer", "Developer", "Consultant".
    3. EXPAND ABBREVIATIONS: "JS" -> "Javascript".
    4. Do NOT include the location in these keywords.
    
    Output Format:
    Return a list of the found jobs with title, company, snippet, and URL.
    Also return the list of optimized keywords.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are a helpful job hunter assistant. 
        When you find search results, summarize them clearly.
        Try to find at least 4-5 distinct job listings if possible.
        At the end of your response, strictly output a JSON block (wrapped in \`\`\`json \`\`\`) containing:
        {
          "refinedKeywords": ["keyword1", "keyword2"]
        }
        The main text response should just list the jobs found in a human readable way.`
      },
    });

    const fullText = response.text || "";
    
    // Parse Grounding Metadata for actionable links
    const posts: JobPost[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract links from grounding metadata which are the actual sources
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        posts.push({
          title: chunk.web.title || "Job Opportunity",
          company: "Unknown (See Link)",
          snippet: "Click to view source...",
          url: chunk.web.uri,
          source: "Web Search"
        });
      }
    });

    // Try to extract the JSON block for refined keywords
    let refinedKeywords: string[] = [role]; 
    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        if (data.refinedKeywords && Array.isArray(data.refinedKeywords)) {
          refinedKeywords = data.refinedKeywords;
        }
      } catch (e) {
        console.warn("Failed to parse refined keywords JSON", e);
      }
    }

    return {
      posts,
      refinedKeywords
    };

  } catch (error) {
    console.error("Error searching jobs:", error);
    throw error;
  }
};
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { 
        status: 405,
        headers: corsHeaders
      });
    }

    const { query } = await req.json();
    if (!query) {
      return new Response("Query parameter is required", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // For demonstration purposes, we'll simulate search results
    // In a production environment, you would use a real search API
    const simulatedResults = [
      {
        title: `Search result for "${query.substring(0, 30)}..."`,
        url: "https://example.com/article1",
        snippet: `This is a simulated search result for "${query.substring(0, 50)}...". In a real implementation, this would contain actual search results from the web.`
      },
      {
        title: `Academic paper related to "${query.substring(0, 25)}..."`,
        url: "https://example.com/article2",
        snippet: `Another simulated result showing how the search would work for "${query.substring(0, 40)}...". This would typically contain a relevant excerpt from a web page.`
      },
      {
        title: `Educational resource about "${query.substring(0, 20)}..."`,
        url: "https://example.com/article3",
        snippet: `A third simulated result demonstrating multiple search results for "${query.substring(0, 30)}...". In production, this would connect to a search API.`
      }
    ];

    return new Response(JSON.stringify(simulatedResults), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error in web-search function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
});
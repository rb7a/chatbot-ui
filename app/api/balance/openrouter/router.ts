import { ServerRuntime } from "next"
import fetch from "node-fetch"

export const runtime: ServerRuntime = "edge"

export async function GET(request: Request) {
  const url = new URL(request.url);
  const apiKey = url.searchParams.get("apiKey");

  if (!apiKey) {
    return new Response(JSON.stringify({ message: "API key is required" }), {
      status: 400
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    });
  }
}
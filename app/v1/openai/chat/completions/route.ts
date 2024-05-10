import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
export const runtime: ServerRuntime = "edge"


export async function POST(request: Request) {
  const json = await request.json();
  const {
    model,
    messages,
    frequency_penalty = 0,
    temperature = 0.8,
    top_p = 1,
    n = 1,
    stop = null,
    max_tokens = 4096, // 修改默认值
    presence_penalty = 0,
    logit_bias = null,
  } = json as Partial<ChatCompletionCreateParamsBase>;

  if (!model || !messages) {
    return new Response(JSON.stringify({ error: { message: "Model and messages are required." } }), {
      status: 400,
    });
  }

  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: "Missing API key" } }), {
      status: 401,
    });
  }

  try {
    checkApiKey(apiKey, "OpenAI");
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      top_p,
      n,
      stop,
      max_tokens,
      presence_penalty,
      frequency_penalty,
      logit_bias,
      stream: true
    });

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error) {
    return handleOpenAIError(error);
  }
}

function handleOpenAIError(error: any): Response {
  let errorMessage = "An unexpected error occurred";
  const errorCode = error.status || 500;

  if (error.message) {
    errorMessage = error.message.includes("api key not found")
      ? "OpenAI API Key not found."
      : error.message.includes("incorrect api key")
      ? "OpenAI API Key is incorrect."
      : error.message;
  }

  return new Response(JSON.stringify({ message: errorMessage }), {
    status: errorCode,
  });
}
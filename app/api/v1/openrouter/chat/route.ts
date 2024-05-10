import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Settings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  // 解构时应用默认值
  const { settings, messages } = json as {
    settings: Settings
    messages: any[]
  }

  // 应用默认设置
  const {
    apikey,
    model,
    prompt = "You are a friendly, helpful AI assistant.",
    temperature = 0.5,
    contextLength = 4096,
    max_tokens = 4096,
  } = settings

  try {
    const openai = new OpenAI({
      apiKey: apikey || "",
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://apiskey.com", // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "Apiskey Api Request", // Optional. Shows in rankings on openrouter.ai.
      },
    })

    const response = await openai.chat.completions.create({
      model: model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: temperature,
      max_tokens: max_tokens,
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenRouter API Key not found. Please set it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
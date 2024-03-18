import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Settings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { settings, messages } = json as {
    settings: Settings
    messages: any[]
  }
  const {
    apikey,
    model,
    prompt = "You are a friendly, helpful AI assistant.",
    temperature = 0.5,
    contextLength = 4096,
    max_tokens = 4096,
  } = settings
  try {

    checkApiKey(apikey, "OpenAI")

    const openai = new OpenAI({
      apiKey: apikey || "",
      organization: ""
    })

    const response = await openai.chat.completions.create({
      model: model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: temperature,
      max_tokens: max_tokens, // TODO: Fix
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Settings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai" // 确认这些导入是否正确
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const {
    model,
    messages,
    temperature = 0.8,
    top_p = 1,
    n = 1,
    stop = null,
    max_tokens = 4096, // 修改默认值
    presence_penalty = 0,
    frequency_penalty = 0,
    logit_bias = null,
  } = json as ChatCompletionCreateParamsBase

  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: "Missing API key" } }), {
      status: 401,
    })
  }

  try {
    checkApiKey(apiKey, "OpenAI")

    const openai = new OpenAI({
      apiKey: apiKey,
      organization: "",
    })

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
      stream: true, // 假设你想要使用流式响应

    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    // 处理错误，给出有用的错误信息
    let errorMessage = "An unexpected error occurred";
    const errorCode = error.status || 500;

    if (error.message) {
      if (error.message.toLowerCase().includes("api key not found")) {
        errorMessage = "OpenAI API Key not found.";
      } else if (error.message.toLowerCase().includes("incorrect api key")) {
        errorMessage = "OpenAI API Key is incorrect.";
      } else {
        errorMessage = error.message;
      }
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
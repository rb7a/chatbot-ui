import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { ServerRuntime } from "next"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()
    checkApiKey(profile.deepseek_api_key, "DeepSeek")

    const apiUrl = "https://api.deepseek.com/chat/completions"

    // 过滤掉 assistant 消息
    const filteredMessages = messages.filter(
      message => message.role !== "assistant"
    )
    // console.log("filteredMessages", filteredMessages)

    const requestBody = {
      model: chatSettings.model,
      messages: filteredMessages,
      temperature: chatSettings.temperature,
      max_tokens: 2048,
      stream: true
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${profile.deepseek_api_key}`,
        Accept: "*/*",
        Host: "api.deepseek.com",
        Connection: "keep-alive"
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    const encoder = new TextEncoder()
    let lastSentTime = Date.now()

    return new Response(
      new ReadableStream({
        async start(controller) {
          if (!reader) {
            controller.close()
            return
          }

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const text = new TextDecoder().decode(value)
              const lines = text.split("\n").filter(line => line.trim() !== "")

              for (const line of lines) {
                if (line.startsWith("data:")) {
                  const jsonData = line.slice(5).trim()

                  if (jsonData === "[DONE]") {
                    controller.close()
                    return
                  }

                  try {
                    const json = JSON.parse(jsonData)
                    if (json.choices && json.choices.length > 0) {
                      const delta = json.choices[0].delta
                      let chunk = ""

                      if (delta.content === null) {
                        chunk =
                          JSON.stringify({
                            reasoning_content: delta.reasoning_content
                          }) + "\n"
                      } else {
                        chunk =
                          JSON.stringify({ content: delta.content }) + "\n"
                      }

                      controller.enqueue(encoder.encode(chunk))
                    }
                  } catch (error) {
                    console.error(
                      "Error parsing DeepSeek response:",
                      error,
                      "Received data:",
                      jsonData
                    )
                  }
                }
              }

              // **每 5 秒发送一个空数据包，防止 Vercel 误判超时**
              if (Date.now() - lastSentTime > 5000) {
                controller.enqueue(encoder.encode(" ")) // 发送一个空格，保持连接
                lastSentTime = Date.now()
              }
            }
          } catch (error) {
            console.error("Stream processing error:", error)
          } finally {
            controller.close()
          }
        }
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "DeepSeek API Key not found. Please set it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

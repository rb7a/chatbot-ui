import { Tables } from "@/supabase/types"
import { LLM, LLMID, OpenRouterLLM } from "@/types"
import { toast } from "sonner"
import { LLM_LIST_MAP } from "./llm/llm-list"

export const fetchHostedModels = async (profile: Tables<"profiles">) => {
  try {
    const providers = ["google", "anthropic", "mistral", "groq", "perplexity"]

    if (profile.use_azure_openai) {
      providers.push("azure")
    } else {
      providers.push("openai")
    }

    const response = await fetch("/api/keys")

    if (!response.ok) {
      throw new Error(`Server is not responding.`)
    }

    const data = await response.json()

    let modelsToAdd: LLM[] = []

    for (const provider of providers) {
      let providerKey: keyof typeof profile

      if (provider === "google") {
        providerKey = "google_gemini_api_key"
      } else if (provider === "azure") {
        providerKey = "azure_openai_api_key"
      } else {
        providerKey = `${provider}_api_key` as keyof typeof profile
      }

      if (profile?.[providerKey] || data.isUsingEnvKeyMap[provider]) {
        const models = LLM_LIST_MAP[provider]

        if (Array.isArray(models)) {
          modelsToAdd.push(...models)
        }
      }
    }

    return {
      envKeyMap: data.isUsingEnvKeyMap,
      hostedModels: modelsToAdd
    }
  } catch (error) {
    console.warn("Error fetching hosted models: " + error)
  }
}

export const fetchOllamaModels = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags"
    )

    if (!response.ok) {
      throw new Error(`Ollama server is not responding.`)
    }

    const data = await response.json()

    const localModels: LLM[] = data.models.map((model: any) => ({
      modelId: model.name as LLMID,
      modelName: model.name,
      provider: "ollama",
      hostedId: model.name,
      platformLink: "https://ollama.ai/library",
      imageInput: false
    }))

    return localModels
  } catch (error) {
    console.warn("Error fetching Ollama models: " + error)
  }
}

export const fetchOpenRouterModels = async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "max-age=0",
        "priority": "u=0, i",
        "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "_ga=GA1.1.999934858.1721007441; __stripe_mid=0eb94baa-f194-4a45-8347-0166eb8f71ec804057; __client_uat=1730707749; __client_uat_NO6jtgZM=1730707749; __refresh_NO6jtgZM=IphPW4uiMG1lCNvSv9G7; ph_phc_7ToS2jDeWBlMu4n2JoNzoA1FnArdKwFMFoHVnAqQ6O1_posthog=%7B%22distinct_id%22%3A%22user_2btHHsx33c7FRPswoeRbwX79V3Q%22%2C%22%24sesid%22%3A%5B1730709565181%2C%220192f638-62a2-71c7-811d-eee9ab9f6662%22%2C1730707743394%5D%2C%22%24epp%22%3Atrue%7D; _ga_R8YZRJS2XN=GS1.1.1730707743.16.1.1730709958.0.0.0; __session_NO6jtgZM=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yUGlRcWt2UlFlZXB3R3ZrVjFZRDhBb3Q1elIiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL29wZW5yb3V0ZXIuYWkiLCJleHAiOjE3MzA3MTA5NTUsImlhdCI6MTczMDcxMDg5NSwiaXNzIjoiaHR0cHM6Ly9jbGVyay5vcGVucm91dGVyLmFpIiwibmJmIjoxNzMwNzEwODg1LCJzaWQiOiJzZXNzXzJvTlFyRVFIY0VSd1I1bkp1N05LOGtERkV5ZSIsInN1YiI6InVzZXJfMmJ0SEhzeDMzYzdGUlBzd29lUmJ3WDc5VjNRIn0.TDYZKVZsvdtaGDqGocAlsVM1oDqny0x-WULEsQPvrMa4-5YqdjEJszDO7UBocyPDPGcxyfh6gFPWoOM-rOOSKQTs4mOWOz2RKcFCkakVBlEkyeqBD0whTHI1e5JzPDdsq1EAVODnX9nUtN4aZfEyGODrZRrvoHD9ZBe2sQ0S-ofNHRs6EKa80Zicz-xrIQHqnD2IqRgw7eaWLIJECkIvO3j9ZXYAYx_Rvape5U96g6vwvxmC6Od2JvlAcioYoJVZZiLXYQhbDK047YtxOz_kgvNRvWyRkOKumldSDBR1TGTt5AlF5wK7c0i2XozDQCW5l1EwT5NW-jiXB7fR2m4ZQQ; __session=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yUGlRcWt2UlFlZXB3R3ZrVjFZRDhBb3Q1elIiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL29wZW5yb3V0ZXIuYWkiLCJleHAiOjE3MzA3MTA5NTUsImlhdCI6MTczMDcxMDg5NSwiaXNzIjoiaHR0cHM6Ly9jbGVyay5vcGVucm91dGVyLmFpIiwibmJmIjoxNzMwNzEwODg1LCJzaWQiOiJzZXNzXzJvTlFyRVFIY0VSd1I1bkp1N05LOGtERkV5ZSIsInN1YiI6InVzZXJfMmJ0SEhzeDMzYzdGUlBzd29lUmJ3WDc5VjNRIn0.TDYZKVZsvdtaGDqGocAlsVM1oDqny0x-WULEsQPvrMa4-5YqdjEJszDO7UBocyPDPGcxyfh6gFPWoOM-rOOSKQTs4mOWOz2RKcFCkakVBlEkyeqBD0whTHI1e5JzPDdsq1EAVODnX9nUtN4aZfEyGODrZRrvoHD9ZBe2sQ0S-ofNHRs6EKa80Zicz-xrIQHqnD2IqRgw7eaWLIJECkIvO3j9ZXYAYx_Rvape5U96g6vwvxmC6Od2JvlAcioYoJVZZiLXYQhbDK047YtxOz_kgvNRvWyRkOKumldSDBR1TGTt5AlF5wK7c0i2XozDQCW5l1EwT5NW-jiXB7fR2m4ZQQ",
        "Referer": "https://openrouter.ai/docs/models",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    });

    if (!response.ok) {
      throw new Error(`OpenRouter server is not responding.`)
    }

    const { data } = await response.json()

    const openRouterModels = data.map(
      (model: {
        id: string
        name: string
        context_length: number
      }): OpenRouterLLM => ({
        modelId: model.id as LLMID,
        modelName: model.id,
        provider: "openrouter",
        hostedId: model.name,
        platformLink: "https://openrouter.dev",
        imageInput: false,
        maxContext: model.context_length
      })
    )

    return openRouterModels
  } catch (error) {
    console.error("Error fetching Open Router models: " + error)
    toast.error("Error fetching Open Router models: " + error)
  }
}

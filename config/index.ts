// config/supabase.ts

export let supabaseServerUrl = ''
export let supabasePublicUrl = ''
export let supabaseAnonKey = ''
export let supabaseServiceRoleKey = ''



// 服务端运行时动态获取请求头（Next.js App Router 支持）
function getDynamicHostUrl(): string {
    try {
        // 只有在服务端请求中 headers() 可用
        const headersList = require('next/headers').headers
        const headers = headersList()
        const protocol = headers.get('x-forwarded-proto') || 'http'
        const host = headers.get('host') || 'localhost:3000'
        console.log("host", host)
        const basePath = '/supabase'
        return `${protocol}://${host}${basePath}`
    } catch (e) {
        // fallback: 构建时或非请求上下文
        return 'http://localhost:8000'
    }
}

if (process.env.NEXT_PUBLIC_SUPABASE_SERVER_URL) {
    supabaseServerUrl = process.env.NEXT_PUBLIC_SUPABASE_SERVER_URL
}
else {
    supabaseServerUrl = 'http://kong:8000'
}
if (process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL) {
    supabasePublicUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL
} else {
    supabasePublicUrl = getDynamicHostUrl()
}
supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const SUPABASE_SERVER_URL: string = supabaseServerUrl
export const SUPABASE_PUBLIC_URL: string = supabasePublicUrl
export const SUPABASE_ANON_KEY: string = supabaseAnonKey
export const SUPABASE_SERVICE_ROLE_KEY: string = supabaseServiceRoleKey

// HOW TO USE:
// import { SUPABASE_SERVER_URL, PUBLIC_SUPABASE_URL } from '@/config/supabase'
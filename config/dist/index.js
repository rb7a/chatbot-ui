"use strict";
// config/supabase.ts
exports.__esModule = true;
exports.SUPABASE_SERVICE_ROLE_KEY = exports.SUPABASE_ANON_KEY = exports.SUPABASE_PUBLIC_URL = exports.SUPABASE_SERVER_URL = exports.supabaseServiceRoleKey = exports.supabaseAnonKey = exports.supabasePublicUrl = exports.supabaseServerUrl = void 0;
exports.supabaseServerUrl = '';
exports.supabasePublicUrl = '';
exports.supabaseAnonKey = '';
exports.supabaseServiceRoleKey = '';
// 服务端运行时动态获取请求头（Next.js App Router 支持）
function getDynamicHostUrl() {
    try {
        // 只有在服务端请求中 headers() 可用
        var headersList = require('next/headers').headers;
        var headers = headersList();
        var protocol = headers.get('x-forwarded-proto') || 'http';
        var host = headers.get('host') || 'localhost:3000';
        console.log("host", host);
        var basePath = '/supabase';
        return protocol + "://" + host + basePath;
    }
    catch (e) {
        // fallback: 构建时或非请求上下文
        return 'http://localhost:8000';
    }
}
if (process.env.NEXT_PUBLIC_SUPABASE_SERVER_URL) {
    exports.supabaseServerUrl = process.env.NEXT_PUBLIC_SUPABASE_SERVER_URL;
}
else {
    exports.supabaseServerUrl = 'http://kong:8000';
}
if (process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL) {
    exports.supabasePublicUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL;
}
else {
    exports.supabasePublicUrl = getDynamicHostUrl();
}
exports.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
exports.supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
exports.SUPABASE_SERVER_URL = exports.supabaseServerUrl;
exports.SUPABASE_PUBLIC_URL = exports.supabasePublicUrl;
exports.SUPABASE_ANON_KEY = exports.supabaseAnonKey;
exports.SUPABASE_SERVICE_ROLE_KEY = exports.supabaseServiceRoleKey;
// HOW TO USE:
// import { SUPABASE_SERVER_URL, PUBLIC_SUPABASE_URL } from '@/config/supabase'

module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/packages/integrations/src/redis/inMemoryProvider.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InMemoryProvider",
    ()=>InMemoryProvider
]);
function emptyRecord() {
    return {
        mode: "normal",
        preferences: [],
        feedback: []
    };
}
class InMemoryProvider {
    name = "memory";
    store = new Map();
    record(sessionId) {
        let r = this.store.get(sessionId);
        if (!r) {
            r = emptyRecord();
            this.store.set(sessionId, r);
        }
        return r;
    }
    async getPreferences(sessionId) {
        return [
            ...this.record(sessionId).preferences
        ];
    }
    async savePreferences(sessionId, preferences) {
        this.record(sessionId).preferences = [
            ...preferences
        ];
    }
    async appendFeedback(sessionId, feedback) {
        this.record(sessionId).feedback.push(feedback);
    }
    async getSessionMode(sessionId) {
        return this.record(sessionId).mode;
    }
    async setSessionMode(sessionId, mode) {
        this.record(sessionId).mode = mode;
    }
    async saveNextAdDecision(sessionId, decision) {
        this.record(sessionId).nextAd = decision;
    }
    async clear(sessionId) {
        this.store.delete(sessionId);
    }
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/packages/integrations/src/redis/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TTL_SECONDS",
    ()=>TTL_SECONDS,
    "key",
    ()=>key
]);
const TTL_SECONDS = {
    session: 60 * 60 * 2,
    feedback: 60 * 60 * 2,
    preferences: 60 * 60 * 24,
    nextAd: 60 * 60 * 2
};
function key(kind, sessionId) {
    return `ad-demo:${kind}:${sessionId}`;
}
}),
"[project]/packages/integrations/src/redis/upstashProvider.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UpstashProvider",
    ()=>UpstashProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@upstash/redis/nodejs.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integrations/src/redis/types.ts [app-route] (ecmascript)");
;
;
class UpstashProvider {
    name = "redis";
    redis;
    constructor(options){
        this.redis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Redis"]({
            url: options.url,
            token: options.token
        });
    }
    async getPreferences(sessionId) {
        const raw = await this.redis.get((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("preferences", sessionId));
        return Array.isArray(raw) ? raw : [];
    }
    async savePreferences(sessionId, preferences) {
        await this.redis.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("preferences", sessionId), preferences, {
            ex: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTL_SECONDS"].preferences
        });
    }
    async appendFeedback(sessionId, feedback) {
        const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("feedback", sessionId);
        await this.redis.rpush(k, JSON.stringify(feedback));
        await this.redis.expire(k, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTL_SECONDS"].feedback);
    }
    async getSessionMode(sessionId) {
        const raw = await this.redis.get((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("session", sessionId));
        return raw?.mode ?? "normal";
    }
    async setSessionMode(sessionId, mode) {
        const record = {
            mode
        };
        await this.redis.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("session", sessionId), record, {
            ex: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTL_SECONDS"].session
        });
    }
    async saveNextAdDecision(sessionId, decision) {
        await this.redis.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("next-ad", sessionId), decision, {
            ex: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTL_SECONDS"].nextAd
        });
    }
    async clear(sessionId) {
        await Promise.all([
            this.redis.del((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("session", sessionId)),
            this.redis.del((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("preferences", sessionId)),
            this.redis.del((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("feedback", sessionId)),
            this.redis.del((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["key"])("next-ad", sessionId))
        ]);
    }
}
}),
"[project]/packages/integrations/src/redis/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_resetMemoryProvider",
    ()=>_resetMemoryProvider,
    "getMemoryProvider",
    ()=>getMemoryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$inMemoryProvider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integrations/src/redis/inMemoryProvider.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$upstashProvider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integrations/src/redis/upstashProvider.ts [app-route] (ecmascript)");
;
;
;
;
;
let cached;
function getMemoryProvider() {
    if (cached) return cached;
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const enabled = process.env.NEXT_PUBLIC_REDIS_ENABLED === "true";
    if (enabled && url && token) {
        try {
            cached = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$upstashProvider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UpstashProvider"]({
                url,
                token
            });
            return cached;
        } catch  {
        // fall through to in-memory
        }
    }
    cached = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$inMemoryProvider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InMemoryProvider"]();
    return cached;
}
function _resetMemoryProvider() {
    cached = undefined;
}
}),
"[project]/packages/integrations/src/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integrations/src/redis/index.ts [app-route] (ecmascript) <locals>");
;
}),
"[project]/apps/web/app/api/_lib/http.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiError",
    ()=>apiError,
    "getSessionId",
    ()=>getSessionId,
    "parseJson",
    ()=>parseJson
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$ZodError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/ZodError.js [app-route] (ecmascript)");
;
;
function apiError(code, message, status, fallbackUsed = false) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: false,
        code,
        message,
        fallbackUsed
    }, {
        status
    });
}
async function parseJson(request, schema) {
    let raw;
    try {
        raw = await request.json();
    } catch  {
        return {
            ok: false,
            response: apiError("VALIDATION_ERROR", "Request body is not valid JSON.", 400)
        };
    }
    try {
        const data = schema.parse(raw);
        return {
            ok: true,
            data
        };
    } catch (err) {
        const message = err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$ZodError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZodError"] ? err.issues.map((i)=>`${i.path.join(".")}: ${i.message}`).join("; ") : "Invalid request shape.";
        return {
            ok: false,
            response: apiError("VALIDATION_ERROR", message, 400)
        };
    }
}
function getSessionId(request) {
    return new URL(request.url).searchParams.get("sessionId");
}
}),
"[project]/apps/web/app/api/memory/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integrations/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integrations/src/redis/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/api/_lib/http.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    const sessionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionId"])(request);
    if (!sessionId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])("VALIDATION_ERROR", "sessionId query param is required.", 400);
    }
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getMemoryProvider"])();
    const fallbacksEnabled = process.env.ENABLE_PROVIDER_FALLBACKS !== "false";
    try {
        const [preferences, currentMode] = await Promise.all([
            provider.getPreferences(sessionId),
            provider.getSessionMode(sessionId)
        ]);
        const body = {
            sessionId,
            preferences,
            currentMode,
            provider: provider.name
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(body);
    } catch (err) {
        console.warn("[/api/memory GET] provider read failed", {
            provider: provider.name,
            message: err instanceof Error ? err.message : "unknown"
        });
        if (!fallbacksEnabled) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])("PROVIDER_UNAVAILABLE", "Memory provider unavailable.", 503);
        }
        const body = {
            sessionId,
            preferences: [],
            currentMode: "normal",
            provider: "memory"
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(body, {
            headers: {
                "x-fallback-used": "true"
            }
        });
    }
}
async function DELETE(request) {
    const sessionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionId"])(request);
    if (!sessionId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])("VALIDATION_ERROR", "sessionId query param is required.", 400);
    }
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getMemoryProvider"])();
    const fallbacksEnabled = process.env.ENABLE_PROVIDER_FALLBACKS !== "false";
    try {
        await provider.clear(sessionId);
    } catch (err) {
        console.warn("[/api/memory DELETE] provider clear failed", {
            provider: provider.name,
            message: err instanceof Error ? err.message : "unknown"
        });
        if (!fallbacksEnabled) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])("PROVIDER_UNAVAILABLE", "Memory provider unavailable.", 503);
        }
    }
    const body = {
        sessionId,
        cleared: true
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(body);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1efqv64._.js.map
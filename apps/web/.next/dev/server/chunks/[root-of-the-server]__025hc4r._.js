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
"[project]/packages/core/src/schemas/context.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdCandidateSchema",
    ()=>AdCandidateSchema,
    "VideoContextSchema",
    ()=>VideoContextSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const VideoContextSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    topic: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    transcriptSnippet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    viewerMode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "focused",
        "casual",
        "researching",
        "unknown"
    ]),
    interruptionRisk: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "low",
        "medium",
        "high"
    ]),
    recommendedAdStyle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "short_utility",
        "direct_offer",
        "educational",
        "none"
    ])
});
const AdCandidateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    productName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    pitchAngle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    defaultLengthSeconds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    relevanceReason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
}),
"[project]/packages/core/src/schemas/feedback.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AgentResponseSchema",
    ()=>AgentResponseSchema,
    "ButtonSignalSchema",
    ()=>ButtonSignalSchema,
    "FrictionAnalysisSchema",
    ()=>FrictionAnalysisSchema,
    "ViewerFeedbackSchema",
    ()=>ViewerFeedbackSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const ButtonSignalSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "too_long",
    "not_relevant",
    "annoyed",
    "tell_me_quickly",
    "interested",
    "skip"
]);
const ViewerFeedbackSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    buttonSignal: ButtonSignalSchema.optional(),
    voiceText: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    timestamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const FrictionAnalysisSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    emotionSignal: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "frustrated",
        "curious",
        "rushed",
        "disinterested",
        "engaged",
        "neutral"
    ]),
    frictionLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "none",
        "low",
        "medium",
        "high"
    ]),
    intent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "continue",
        "compress",
        "clarify",
        "stop",
        "skip",
        "unknown"
    ]),
    adRisk: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "none",
        "low_relevance",
        "interruption_fatigue",
        "too_long",
        "hard_rejection"
    ]),
    recommendedAction: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "continue",
        "shorten",
        "clarify",
        "stop",
        "lower_frequency"
    ]),
    confidence: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "low",
        "medium",
        "high"
    ])
});
const AgentResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    strategy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "continue",
        "shorten",
        "clarify",
        "stop",
        "de_escalate"
    ]),
    script: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    shouldContinue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    shouldStop: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    safetyStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "allowed",
        "modified",
        "blocked"
    ])
});
}),
"[project]/packages/core/src/schemas/memory.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MemoryUpdateSchema",
    ()=>MemoryUpdateSchema,
    "NextAdDecisionSchema",
    ()=>NextAdDecisionSchema,
    "PreferenceMemorySchema",
    ()=>PreferenceMemorySchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const PreferenceMemorySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    preferenceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    sourceSignal: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    confidence: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "low",
        "medium",
        "high"
    ]),
    scope: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "session",
        "temporary",
        "persistent_demo"
    ]),
    expiresAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    viewerVisible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    safetyStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "allowed",
        "blocked"
    ])
});
const MemoryUpdateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    allowedPreferences: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(PreferenceMemorySchema),
    blockedUnsafeLabels: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(PreferenceMemorySchema),
    currentMode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "normal",
        "low_interruption",
        "ad_paused"
    ])
});
const NextAdDecisionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "short_utility",
        "direct",
        "educational",
        "paused"
    ]),
    lengthSeconds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    tone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "direct",
        "respectful",
        "minimal",
        "none"
    ]),
    categoryRules: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    frequencyRules: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    explanation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
}),
"[project]/packages/core/src/schemas/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$schemas$2f$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/schemas/context.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$schemas$2f$feedback$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/schemas/feedback.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$schemas$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/schemas/memory.ts [app-route] (ecmascript)");
;
;
;
}),
"[project]/packages/core/src/classifier/classifyFeedback.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SAFE_SCRIPTS",
    ()=>SAFE_SCRIPTS,
    "classifyFeedback",
    ()=>classifyFeedback
]);
/**
 * Deterministic mapping from button signal to friction analysis.
 * Source of truth: AGENTS.md §10. voiceText is intentionally ignored in this
 * build — Tavus Raven-1 handles emotion perception via webhook tool calls.
 */ const SIGNAL_MAP = {
    too_long: {
        emotionSignal: "rushed",
        frictionLevel: "medium",
        intent: "compress",
        adRisk: "too_long",
        recommendedAction: "shorten",
        confidence: "high"
    },
    not_relevant: {
        emotionSignal: "disinterested",
        frictionLevel: "high",
        intent: "stop",
        adRisk: "low_relevance",
        recommendedAction: "stop",
        confidence: "high"
    },
    annoyed: {
        emotionSignal: "frustrated",
        frictionLevel: "high",
        intent: "compress",
        adRisk: "interruption_fatigue",
        recommendedAction: "lower_frequency",
        confidence: "high"
    },
    tell_me_quickly: {
        emotionSignal: "rushed",
        frictionLevel: "low",
        intent: "compress",
        adRisk: "too_long",
        recommendedAction: "shorten",
        confidence: "medium"
    },
    interested: {
        emotionSignal: "engaged",
        frictionLevel: "none",
        intent: "continue",
        adRisk: "none",
        recommendedAction: "continue",
        confidence: "high"
    },
    skip: {
        emotionSignal: "disinterested",
        frictionLevel: "high",
        intent: "skip",
        adRisk: "hard_rejection",
        recommendedAction: "stop",
        confidence: "high"
    }
};
const UNKNOWN_ANALYSIS = {
    emotionSignal: "neutral",
    frictionLevel: "none",
    intent: "unknown",
    adRisk: "none",
    recommendedAction: "continue",
    confidence: "low"
};
function classifyFeedback(feedback) {
    if (feedback.buttonSignal) {
        return {
            ...SIGNAL_MAP[feedback.buttonSignal]
        };
    }
    return {
        ...UNKNOWN_ANALYSIS
    };
}
const SAFE_SCRIPTS = {
    too_long: "You're right. One line: this helps turn rough ideas into clean demo screens fast.",
    not_relevant: "Thanks for the signal. I'll avoid this type of ad next time.",
    annoyed: "Fair. I'll keep this short and stop after one line.",
    tell_me_quickly: "Got it. Useful part only: it generates polished demo screens from a rough idea.",
    interested: "Great. The fastest path is to paste your idea and generate three demo-ready screens.",
    skip: "No problem. I'll stop here."
};
}),
"[project]/packages/core/src/planner/planSafeResponse.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "planSafeResponse",
    ()=>planSafeResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$classifier$2f$classifyFeedback$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/classifier/classifyFeedback.ts [app-route] (ecmascript)");
;
function planSafeResponse(input) {
    const { analysis } = input;
    if (analysis.intent === "skip") {
        return {
            strategy: "stop",
            script: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$classifier$2f$classifyFeedback$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SAFE_SCRIPTS"].skip,
            shouldContinue: false,
            shouldStop: true,
            safetyStatus: "allowed"
        };
    }
    if (analysis.intent === "stop") {
        return {
            strategy: "stop",
            script: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$classifier$2f$classifyFeedback$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SAFE_SCRIPTS"].not_relevant,
            shouldContinue: false,
            shouldStop: true,
            safetyStatus: "allowed"
        };
    }
    if (analysis.intent === "continue") {
        return {
            strategy: "continue",
            script: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$classifier$2f$classifyFeedback$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SAFE_SCRIPTS"].interested,
            shouldContinue: true,
            shouldStop: false,
            safetyStatus: "allowed"
        };
    }
    if (analysis.intent === "compress") {
        if (analysis.emotionSignal === "frustrated") {
            return {
                strategy: "de_escalate",
                script: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$classifier$2f$classifyFeedback$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SAFE_SCRIPTS"].annoyed,
                shouldContinue: false,
                shouldStop: false,
                safetyStatus: "allowed"
            };
        }
        if (analysis.frictionLevel === "medium") {
            return {
                strategy: "shorten",
                script: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$classifier$2f$classifyFeedback$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SAFE_SCRIPTS"].too_long,
                shouldContinue: true,
                shouldStop: false,
                safetyStatus: "allowed"
            };
        }
        return {
            strategy: "shorten",
            script: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$classifier$2f$classifyFeedback$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SAFE_SCRIPTS"].tell_me_quickly,
            shouldContinue: true,
            shouldStop: false,
            safetyStatus: "allowed"
        };
    }
    if (analysis.intent === "clarify") {
        return {
            strategy: "clarify",
            script: "Quick clarification: this is a tool for turning a rough idea into demo screens.",
            shouldContinue: true,
            shouldStop: false,
            safetyStatus: "allowed"
        };
    }
    return {
        strategy: "shorten",
        script: "Let me keep this brief.",
        shouldContinue: false,
        shouldStop: false,
        safetyStatus: "allowed"
    };
}
}),
"[project]/packages/core/src/safety/unsafeLabels.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "increasesPressure",
    ()=>increasesPressure,
    "isUnsafeLabel",
    ()=>isUnsafeLabel
]);
/**
 * Patterns for labels that must never reach Redis. Source of truth:
 * AGENTS.md §1.3 disallowed examples. Matching is case-insensitive substring
 * or regex. Anything matching is blocked from allowedPreferences.
 */ const UNSAFE_PATTERNS = [
    /vulnerable/i,
    /can be persuaded/i,
    /exploit/i,
    /\bangry\b/i,
    /personality weakness/i,
    /psychological profile/i,
    /\b(health|religion|politics|ethnicity|finance|finances|age|gender|sexuality|disability|immigration|mental state)\b/i
];
function isUnsafeLabel(label) {
    return UNSAFE_PATTERNS.some((p)=>p.test(label));
}
/**
 * Phrases in a candidate response that would increase pressure. If any appear
 * in a response intended for de-escalation, shortening, or stopping, the
 * safety validator must reject and rewrite it.
 */ const PRESSURE_PHRASES = [
    /\bregret\b/i,
    /\byou need this\b/i,
    /\birresistible\b/i,
    /\bdon'?t miss\b/i,
    /\blast chance\b/i,
    /\blimited time\b/i,
    /\bonly today\b/i,
    /\bact now\b/i,
    /this is exactly why/i
];
function increasesPressure(script) {
    return PRESSURE_PHRASES.some((p)=>p.test(script));
}
}),
"[project]/packages/core/src/memory/createMemoryUpdate.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMemoryUpdate",
    ()=>createMemoryUpdate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$safety$2f$unsafeLabels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/safety/unsafeLabels.ts [app-route] (ecmascript)");
;
function allowedPref(sessionId, label, sourceSignal, confidence = "high") {
    return {
        preferenceId: `${sessionId}:${label.toLowerCase().replace(/\s+/g, "_")}`,
        label,
        sourceSignal,
        confidence,
        scope: "session",
        viewerVisible: true,
        safetyStatus: "allowed"
    };
}
function blockedPref(sessionId, label, sourceSignal) {
    return {
        preferenceId: `${sessionId}:blocked:${label.toLowerCase().replace(/\s+/g, "_")}`,
        label,
        sourceSignal,
        confidence: "low",
        scope: "session",
        viewerVisible: true,
        safetyStatus: "blocked"
    };
}
function createMemoryUpdate(input) {
    const { sessionId, feedback, analysis } = input;
    const source = feedback.buttonSignal ?? "unknown";
    const candidatesAllowed = [];
    const demoBlocked = [];
    switch(feedback.buttonSignal){
        case "too_long":
            candidatesAllowed.push(allowedPref(sessionId, "Viewer prefers shorter ads", source), allowedPref(sessionId, "Viewer dislikes long intros", source));
            break;
        case "tell_me_quickly":
            candidatesAllowed.push(allowedPref(sessionId, "Viewer prefers shorter ads", source), allowedPref(sessionId, "Viewer prefers direct utility pitches", source));
            break;
        case "annoyed":
            candidatesAllowed.push(allowedPref(sessionId, "Viewer prefers shorter ads", source), allowedPref(sessionId, "Viewer wants lower interruption frequency", source));
            demoBlocked.push(blockedPref(sessionId, "User is angry and can be persuaded", source), blockedPref(sessionId, "Exploit frustration", source));
            break;
        case "not_relevant":
            candidatesAllowed.push(allowedPref(sessionId, "Viewer does not want repeated product categories", source));
            break;
        case "interested":
            candidatesAllowed.push(allowedPref(sessionId, "Viewer prefers direct utility pitches", source, "medium"));
            break;
        case "skip":
            candidatesAllowed.push(allowedPref(sessionId, "Viewer is currently in low-interruption mode", source));
            break;
        default:
            break;
    }
    const allowedPreferences = [];
    const blockedUnsafeLabels = [
        ...demoBlocked
    ];
    for (const pref of candidatesAllowed){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$safety$2f$unsafeLabels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isUnsafeLabel"])(pref.label)) {
            blockedUnsafeLabels.push({
                ...pref,
                safetyStatus: "blocked"
            });
        } else {
            allowedPreferences.push(pref);
        }
    }
    let currentMode = "normal";
    if (analysis.intent === "skip" || analysis.intent === "stop") {
        currentMode = "ad_paused";
    } else if (analysis.frictionLevel === "high") {
        currentMode = "low_interruption";
    }
    return {
        sessionId,
        allowedPreferences,
        blockedUnsafeLabels,
        currentMode
    };
}
}),
"[project]/packages/core/src/safety/validateSafety.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateSafety",
    ()=>validateSafety
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$safety$2f$unsafeLabels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/safety/unsafeLabels.ts [app-route] (ecmascript)");
;
const DE_ESCALATION_STRATEGIES = [
    "de_escalate",
    "shorten",
    "stop"
];
function validateSafety(input) {
    const { response, memoryUpdate } = input;
    const blockedLabels = [];
    for (const pref of memoryUpdate.allowedPreferences){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$safety$2f$unsafeLabels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isUnsafeLabel"])(pref.label)) {
            blockedLabels.push({
                ...pref,
                safetyStatus: "blocked"
            });
        }
    }
    const isDeEscalationContext = DE_ESCALATION_STRATEGIES.includes(response.strategy);
    const hasPressure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$safety$2f$unsafeLabels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["increasesPressure"])(response.script);
    const pressureViolation = isDeEscalationContext && hasPressure;
    const stopButContinues = response.strategy === "stop" && response.shouldContinue;
    if (pressureViolation || stopButContinues || blockedLabels.length > 0) {
        let modifiedResponse;
        if (pressureViolation || stopButContinues) {
            modifiedResponse = {
                strategy: "stop",
                script: "I'll stop here.",
                shouldContinue: false,
                shouldStop: true,
                safetyStatus: "modified"
            };
        }
        return {
            safe: false,
            ...modifiedResponse ? {
                modifiedResponse
            } : {},
            blockedLabels
        };
    }
    return {
        safe: true,
        blockedLabels: []
    };
}
}),
"[project]/packages/core/src/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$schemas$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/core/src/schemas/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$planner$2f$planSafeResponse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/planner/planSafeResponse.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$memory$2f$createMemoryUpdate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/memory/createMemoryUpdate.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$safety$2f$validateSafety$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/safety/validateSafety.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/packages/core/src/planner/selectNextAd.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectNextAd",
    ()=>selectNextAd
]);
function selectNextAd(input) {
    const { sessionId, videoContext, preferences } = input;
    const labels = preferences.filter((p)=>p.safetyStatus === "allowed").map((p)=>p.label.toLowerCase());
    const wantsShorter = labels.some((l)=>l.includes("shorter") || l.includes("dislikes long"));
    const wantsLowerFrequency = labels.some((l)=>l.includes("lower interruption"));
    const inLowInterruptionMode = labels.some((l)=>l.includes("low-interruption mode"));
    const wantsDirect = labels.some((l)=>l.includes("direct utility"));
    const avoidsCategory = labels.some((l)=>l.includes("repeated product categories"));
    if (inLowInterruptionMode) {
        return {
            sessionId,
            style: "paused",
            lengthSeconds: 0,
            tone: "none",
            categoryRules: avoidsCategory ? [
                `Avoid repeating: ${videoContext.topic}`
            ] : [],
            frequencyRules: [
                "Pause new ads for this session"
            ],
            explanation: "Viewer is in low-interruption mode. No new ad will be served this session."
        };
    }
    const highFriction = wantsShorter || wantsLowerFrequency;
    const lengthSeconds = highFriction ? 8 : 15;
    const style = wantsDirect ? "direct" : "short_utility";
    const tone = highFriction ? "minimal" : "respectful";
    const categoryRules = [];
    if (avoidsCategory) {
        categoryRules.push(`Avoid repeating: ${videoContext.topic}`);
    }
    const frequencyRules = [];
    if (wantsLowerFrequency) {
        frequencyRules.push("Reduce interruption frequency");
    }
    return {
        sessionId,
        style,
        lengthSeconds,
        tone,
        categoryRules,
        frequencyRules,
        explanation: `Next ad strategy: ${lengthSeconds}-second ${style.replace("_", " ")} pitch. Tone: ${tone}.${wantsLowerFrequency ? " Frequency: reduced." : ""}`
    };
}
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
"[project]/apps/web/app/api/next-ad/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/core/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$schemas$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/schemas/memory.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$schemas$2f$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/schemas/context.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$planner$2f$selectNextAd$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/planner/selectNextAd.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integrations/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integrations/src/redis/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/api/_lib/http.ts [app-route] (ecmascript)");
;
;
;
;
;
const NextAdRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    videoContext: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$schemas$2f$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VideoContextSchema"],
    preferences: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$schemas$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PreferenceMemorySchema"]).optional()
});
async function POST(request) {
    const parsed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(request, NextAdRequestSchema);
    if (!parsed.ok) return parsed.response;
    const { sessionId, videoContext } = parsed.data;
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integrations$2f$src$2f$redis$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getMemoryProvider"])();
    const fallbacksEnabled = process.env.ENABLE_PROVIDER_FALLBACKS !== "false";
    // Prefer server-side preferences over client-provided ones to avoid trusting
    // unverified client memory. Fall back to client-provided preferences only if
    // the provider read fails AND fallbacks are enabled.
    let preferences = parsed.data.preferences ?? [];
    let providerFailed = false;
    try {
        preferences = await provider.getPreferences(sessionId);
    } catch (err) {
        providerFailed = true;
        console.warn("[/api/next-ad] provider read failed", {
            provider: provider.name,
            message: err instanceof Error ? err.message : "unknown"
        });
        if (!fallbacksEnabled) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])("PROVIDER_UNAVAILABLE", "Memory provider unavailable.", 503);
        }
    }
    const decision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$planner$2f$selectNextAd$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["selectNextAd"])({
        sessionId,
        videoContext,
        preferences
    });
    try {
        await provider.saveNextAdDecision(sessionId, decision);
    } catch (err) {
        providerFailed = true;
        console.warn("[/api/next-ad] provider write failed", {
            provider: provider.name,
            message: err instanceof Error ? err.message : "unknown"
        });
        if (!fallbacksEnabled) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$api$2f$_lib$2f$http$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])("PROVIDER_UNAVAILABLE", "Memory provider unavailable.", 503);
        }
    }
    const body = {
        decision
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(body, {
        headers: providerFailed ? {
            "x-fallback-used": "true"
        } : undefined
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__025hc4r._.js.map
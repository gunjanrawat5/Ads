# AGENTS.md

## Project: Tavus Interactive AI Video Ad Experience

This repository builds a polished hackathon and demo product: a YouTube-style video ad simulator where a viewer watches a video, a Tavus AI video agent appears with context about what the viewer is watching, delivers a short relevant pitch, accepts viewer feedback, adapts respectfully, and stores transparent preference memory in Redis.

The product promise is simple:

> Ads should understand the moment, not interrupt it.

This is **not** an emotional manipulation engine, not a real YouTube integration, and not an ad targeting system. The demo must prove contextual relevance, viewer control, respectful de-escalation, transparent memory, and a better next-ad decision.

This build is for the AI Tinkerers Emotionally Intelligent AI Hackathon in NYC, hosted with ElevenLabs, Tavus, Redis, and Veris.AI. Tavus and Redis are sponsor integrations that must be used responsibly and visibly. ElevenLabs is optional.

---

## Companion Files

This file is the canonical project spec. Each coding agent also has a companion file with role-specific guidance:

- `CLAUDE.md` at the repo root: backend-specific guidance for the Claude Code agent.
- `CODEX.md` at the repo root: frontend-specific guidance for the Codex agent.

Where a companion file conflicts with `AGENTS.md`:

- For product behavior, safety rules, demo flow, acceptance criteria, and shared schemas: `AGENTS.md` wins.
- For role-specific implementation details (library choice within the locked stack, file layout within a package, internal patterns): the companion file wins.

Every agent reads `AGENTS.md` first, then its companion file.

---

## 1. Non-Negotiable Product Rules

### 1.1 Viewer control comes first

The viewer must always be able to:

- Skip the ad.
- Shorten the ad.
- Reject the ad as irrelevant.
- Express annoyance.
- Clear or edit preference memory.
- Understand what was stored and why.

### 1.2 Negative feedback must reduce pressure

When the viewer says or clicks anything equivalent to:

- `Too long`
- `Not relevant`
- `I'm annoyed`
- `Tell me quickly`
- `Skip this`

The system must never push harder, intensify persuasion, guilt the viewer, or treat frustration as a conversion opportunity.

Allowed behavior:

- Acknowledge.
- Shorten.
- Clarify.
- Stop.
- Reduce future interruption frequency.
- Store only safe preference memory.

Blocked behavior:

- "Since you are annoyed, this is exactly why you need this."
- "You will regret skipping this."
- "I know you are frustrated, so I will make this irresistible."
- Any copy that exploits anger, anxiety, urgency, identity, finances, health, politics, religion, ethnicity, or vulnerability.

### 1.3 Memory must be transparent and safe

The demo may store only viewer-visible ad experience preferences.

Allowed examples:

- Viewer prefers shorter ads.
- Viewer dislikes long intros.
- Viewer prefers direct utility pitches.
- Viewer wants lower interruption frequency.
- Viewer does not want repeated product categories.
- Viewer is currently in low-interruption mode.

Disallowed examples:

- User is vulnerable.
- User is angry and can be persuaded.
- Exploit frustration.
- Target based on health, religion, politics, ethnicity, finances, age, gender, sexuality, disability, immigration status, or mental state.
- Store inferred personality weakness or psychological profile.

### 1.4 Tavus must be central

Tavus is not decorative. The core demo experience must present the ad through a Tavus-powered agent or a Tavus-compatible agent abstraction with a working mock fallback.

Minimum Tavus requirements:

- Dedicated Tavus provider module.
- Tavus agent session creation API path or service function.
- Tavus agent UI surface in the demo.
- A fallback mode that visually preserves the Tavus-agent experience when Tavus API keys or network calls fail.

The specific Tavus product is the Conversational Video Interface (CVI). See section 12 for endpoint and payload.

### 1.5 Redis must be visible in the architecture

Redis stores session state, feedback events, safe preference memory, and next-ad decision state when available.

Minimum Redis requirements:

- Dedicated Redis client and provider module.
- Typed memory schema.
- Safe fallback to in-memory or localStorage-backed demo memory if Redis is unavailable.
- UI must still show memory updates when Redis fails.

The specific Redis client is `@upstash/redis`. See section 13.

### 1.6 The demo must work without external API connectivity

The full judge flow must work when Tavus, the LLM provider, Redis, or ElevenLabs are missing, misconfigured, rate-limited, or offline.

Required fallback behavior:

- Tavus unavailable: show scripted Tavus-style agent card or video placeholder and continue the flow.
- Redis unavailable: use in-memory server fallback plus client localStorage mirror.
- LLM unavailable: use deterministic local classifier and scripted safe responses.
- ElevenLabs unavailable: disable optional voice and TTS gracefully and keep button interaction working.
- Browser speech recognition unavailable (Safari): hide voice input with a clear UI note. Buttons must cover the full demo flow.

Never let a missing API key break the demo.

---

## 2. Agent Operating Model

This project is built by a two-person team using AI coding agents:

- **Frontend developer** uses Codex.
- **Backend developer** uses Claude Code, with Cursor as a backup when Claude rate limits hit.

Each agent stays inside its ownership area, inspects the repository before editing, and avoids creating duplicate implementations.

### 2.1 Codex Agent: Frontend Owner

Codex owns the complete frontend and user experience. See `CODEX.md` for Codex-specific guidance.

Primary responsibilities:

- Next.js app structure under `apps/web`.
- Landing page.
- YouTube-style video simulator.
- Context intelligence panel.
- Tavus agent display surface and iframe embedding.
- Viewer feedback buttons.
- Optional voice feedback UI.
- Adaptive response screen.
- Transparent memory panel.
- Next-ad decision screen.
- Demo state machine.
- Fallback UI states.
- Loading, error, empty, and offline states.
- Accessibility and keyboard support.
- Frontend tests.
- UI polish and responsive layout.

Codex must not directly implement backend business logic inside UI components. Use typed frontend service clients that call backend APIs or shared domain functions from `packages/core`.

### 2.2 Claude Agent: Backend Owner

Claude owns the backend, integrations, data contracts, and safety logic. See `CLAUDE.md` for Claude-specific guidance.

Primary responsibilities:

- API routes under `apps/web/app/api`.
- Tavus provider adapter.
- Redis provider adapter (Upstash REST).
- Optional ElevenLabs provider adapter.
- LLM reasoning adapter (Anthropic SDK).
- Deterministic classifier fallback.
- Safe response planner.
- Memory safety guardrails.
- Next-ad selector.
- Session lifecycle.
- Typed schemas and validation in `packages/core/src/schemas`.
- Backend tests.
- Integration failure handling.
- Rate limits and timeouts.
- Environment validation.

Claude must not redesign frontend screens unless explicitly asked. Backend changes expose stable typed contracts to the frontend.

### 2.3 Cursor Agent: Backend Backup

Cursor is used when Claude hits rate limits or when targeted backend fixes are needed.

Cursor responsibilities:

- Continue backend work from current repository state.
- Patch bugs without creating alternate implementations.
- Preserve existing architecture and locked stack decisions.
- Read `AGENTS.md` and `CLAUDE.md` before every change.
- Inspect current files before editing.

Cursor must not fork the backend into new route versions, new duplicate provider names, or parallel schema files.

---

## 3. Mandatory Repository Inspection Protocol

### 3.1 Initial Repo State Assumption

A Next.js scaffold already exists. Do not recreate it. Do not run `pnpm create next-app` unless you have confirmed the apps/web directory does not exist.

The first action for any agent is verification, not scaffolding. Verify:

- The expected monorepo shape from section 4 is present.
- The required libraries are installed.
- Typecheck and lint pass on the baseline.

If the structure differs from section 4 but is clean, preserve it. Do not restructure unless explicitly asked.

### 3.2 Inspection Commands

Before creating, editing, renaming, or deleting files, every agent must inspect the repository.

Run or perform the equivalent of:

```bash
pwd
ls -la
find . -maxdepth 3 -type f -name "package.json" -not -path "*/node_modules/*" | sort
```

Then inspect the relevant files:

```bash
cat package.json 2>/dev/null || true
cat pnpm-workspace.yaml 2>/dev/null || true
cat turbo.json 2>/dev/null || true
cat tsconfig.json 2>/dev/null || true
cat next.config.* 2>/dev/null || true
cat apps/web/package.json 2>/dev/null || true
cat packages/core/package.json 2>/dev/null || true
```

### 3.3 Library Inventory Before Installing

Before installing any dependency, list what is already present:

```bash
cat apps/web/package.json packages/core/package.json packages/integrations/package.json 2>/dev/null \
  | grep -E "\"(react|next|zod|@upstash|@anthropic|tailwind|vitest|framer|shadcn)" || true
```

Install only what is missing. Never reinstall or upgrade a package without explicit reason.

### 3.4 Pre-Edit Search

Before changing a feature, search for existing implementations:

```bash
grep -R "tavus\|redis\|memory\|feedback\|classifier\|nextAd\|agent" -n . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git || true
```

### 3.5 Rules

- Do not create a new file until you know whether an appropriate file already exists.
- Do not create `ComponentV2`, `NewComponent`, `FinalComponent`, `updatedComponent`, or duplicate route files.
- Do not leave old versions behind after replacing logic.
- Do not keep unused files, unused imports, dead components, stale styles, or orphaned tests.
- If a requested edit replaces previous behavior, remove the previous behavior properly.
- Update imports, exports, tests, docs, and route references in the same change.
- After every material change, run typecheck, lint, and tests where available.

---

## 4. Expected Monorepo Shape

Prefer a Next.js monorepo with clear app and package boundaries.

Recommended structure:

```txt
.
├── apps/
│   └── web/
│       ├── app/
│       │   ├── page.tsx
│       │   ├── demo/
│       │   │   └── page.tsx
│       │   └── api/
│       │       ├── tavus/
│       │       │   └── session/route.ts
│       │       ├── feedback/route.ts
│       │       ├── memory/route.ts
│       │       └── next-ad/route.ts
│       ├── components/
│       │   ├── landing/
│       │   ├── simulator/
│       │   ├── tavus/
│       │   ├── feedback/
│       │   ├── memory/
│       │   └── shared/
│       ├── lib/
│       │   ├── clients/
│       │   ├── state/
│       │   └── utils/
│       └── tests/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   ├── schemas/
│   │   │   ├── safety/
│   │   │   ├── classifier/
│   │   │   ├── planner/
│   │   │   └── fixtures/
│   │   └── tests/
│   ├── integrations/
│   │   ├── src/
│   │   │   ├── tavus/
│   │   │   ├── redis/
│   │   │   ├── llm/
│   │   │   └── elevenlabs/
│   │   └── tests/
│   └── ui/
│       ├── src/
│       └── tests/
├── .env.example
├── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── AGENTS.md
├── CLAUDE.md
├── CODEX.md
└── README.md
```

If the existing repo already uses a different but clean structure, preserve it. Do not restructure the repo unless explicitly asked.

---

## 5. Locked Stack

These decisions are final. Do not introduce alternatives without explicit human approval.

### 5.1 Frontend

- Next.js App Router.
- TypeScript strict mode.
- React server and client components used deliberately.
- Tailwind CSS.
- **shadcn/ui** for primitives. Install: `button`, `card`, `badge`, `avatar`, `dialog`, `progress`, `separator`, `scroll-area`.
- Framer Motion only where it improves demo clarity.
- No additional state management library. Use React state plus a small state machine for demo flow.

### 5.2 Backend

- Next.js API routes (route handlers) for MVP simplicity.
- Shared TypeScript domain package `packages/core` for schemas and pure business logic.
- Zod for runtime validation.
- Provider adapters in `packages/integrations` for Tavus, Redis, LLM, and optional ElevenLabs.
- Deterministic fallback services for offline demo mode.

### 5.3 AI and Media Providers

**Required:**

- Tavus Conversational Video Interface (CVI) for the interactive AI video ad agent.
- Upstash Redis (REST client `@upstash/redis`) for preference and session memory.
- Anthropic SDK (`@anthropic-ai/sdk`) with model `claude-haiku-4-5-20251001` for context summaries, feedback classification on voice text, and optional response polish.

**Optional:**

- ElevenLabs for TTS or voice polish if Tavus voice flow is insufficient.
- Browser SpeechRecognition API for voice input (Chrome and Edge only; Safari unsupported).

**Forbidden second clients:**

- `ioredis`, `redis`, `@vercel/kv` (we use Upstash REST).
- `openai`, `langchain`, or any other LLM SDK (we use Anthropic directly).
- Any Tavus SDK package (we use raw `fetch` against the Tavus REST API).

---

## 6. Environment Variables

Create and maintain `.env.example`. Never commit secrets.

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true

# Tavus CVI
TAVUS_API_KEY=
TAVUS_REPLICA_ID=
TAVUS_PERSONA_ID=
NEXT_PUBLIC_TAVUS_ENABLED=false

# Upstash Redis (REST)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_REDIS_ENABLED=false

# Anthropic LLM
ANTHROPIC_API_KEY=
LLM_MODEL=claude-haiku-4-5-20251001
NEXT_PUBLIC_LLM_ENABLED=false

# Optional ElevenLabs
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
NEXT_PUBLIC_ELEVENLABS_ENABLED=false

# Demo reliability
PROVIDER_TIMEOUT_MS=8000
ENABLE_PROVIDER_FALLBACKS=true
```

Rules:

- `NEXT_PUBLIC_DEMO_MODE=true` must allow the full demo to run with no external provider.
- Provider availability must be detected at runtime, not assumed at build time.
- API routes must return typed fallback responses instead of crashing when provider configuration is missing.
- Never reference a removed env var. If you see `REDIS_URL`, `REDIS_TOKEN`, `LLM_API_KEY`, or `LLM_PROVIDER` anywhere in the codebase, delete them.

---

## 7. Core Demo Flow

The full flow should be completable in 60 to 90 seconds and presentable in under 3 minutes.

1. **Landing page**
   - Hero: `Ads should understand the moment, not interrupt it.`
   - Subcopy: `An interactive AI video ad agent that adapts to video context and viewer feedback in real time.`
   - CTA: `Start Demo`

2. **YouTube-style video simulation**
   - Controlled video title: `How to build a startup demo in 24 hours`
   - Viewer state: focused and interruption-sensitive.
   - Demo context visible.

3. **Context intelligence panel**
   - Topic: startup demo building.
   - Viewer mode: focused.
   - Ad opportunity: developer or design or demo tool.
   - Risk: interruption sensitivity.
   - Recommended style: short utility pitch.

4. **Tavus ad agent appears**
   - Agent delivers a short contextual pitch via Tavus CVI iframe.
   - Example opening:
     - `Hey, I see you're watching a hackathon build video. I'll keep this short. If you're trying to turn a rough idea into a polished demo, this tool helps you create investor-ready mockups in minutes.`

5. **Viewer reaction layer**
   - Buttons:
     - `Too long`
     - `Not relevant`
     - `I'm annoyed`
     - `Tell me quickly`
     - `I'm interested`
     - `Skip this`
   - Optional voice input (Chrome and Edge only):
     - Example: `Bro, I'm trying to watch the video. This is annoying.`

6. **Friction detection**
   - Show friction level, emotion signal, intent, ad risk, and recommended action.

7. **Adaptive response**
   - Agent shortens, clarifies, stops, or continues.
   - Example for annoyance:
     - `Fair. You're in the middle of the video, so I'll make this ten seconds. This is only useful if you need quick demo screens. If not, I'll stop here.`

8. **Memory update**
   - Show safe preference chips:
     - `Prefers shorter ads`
     - `Avoid long intros`
     - `Direct utility pitch`
     - `Reduce interruption frequency`
   - Show blocked unsafe memory examples if triggered.

9. **Next ad decision**
   - Example:
     - `Next ad strategy: 8-second utility-first pitch. Tone: direct and respectful. Frequency: reduced.`

---

## 8. Domain Objects and Type Contracts

All agents must use shared typed schemas. Do not invent slightly different shapes in separate files. Canonical location: `packages/core/src/schemas`.

### 8.1 `VideoContext`

```ts
export type VideoContext = {
  id: string;
  title: string;
  topic: string;
  tags: string[];
  transcriptSnippet: string;
  viewerMode: "focused" | "casual" | "researching" | "unknown";
  interruptionRisk: "low" | "medium" | "high";
  recommendedAdStyle: "short_utility" | "direct_offer" | "educational" | "none";
};
```

### 8.2 `AdCandidate`

```ts
export type AdCandidate = {
  id: string;
  productName: string;
  category: string;
  pitchAngle: string;
  defaultLengthSeconds: number;
  relevanceReason: string;
};
```

### 8.3 `ViewerFeedback`

```ts
export type ViewerFeedback = {
  id: string;
  sessionId: string;
  buttonSignal?:
    | "too_long"
    | "not_relevant"
    | "annoyed"
    | "tell_me_quickly"
    | "interested"
    | "skip";
  voiceText?: string;
  timestamp: string;
};
```

### 8.4 `FrictionAnalysis`

```ts
export type FrictionAnalysis = {
  emotionSignal:
    | "frustrated"
    | "curious"
    | "rushed"
    | "disinterested"
    | "engaged"
    | "neutral";
  frictionLevel: "none" | "low" | "medium" | "high";
  intent: "continue" | "compress" | "clarify" | "stop" | "skip" | "unknown";
  adRisk:
    | "none"
    | "low_relevance"
    | "interruption_fatigue"
    | "too_long"
    | "hard_rejection";
  recommendedAction:
    | "continue"
    | "shorten"
    | "clarify"
    | "stop"
    | "lower_frequency";
  confidence: "low" | "medium" | "high";
};
```

### 8.5 `AgentResponse`

```ts
export type AgentResponse = {
  strategy: "continue" | "shorten" | "clarify" | "stop" | "de_escalate";
  script: string;
  shouldContinue: boolean;
  shouldStop: boolean;
  safetyStatus: "allowed" | "modified" | "blocked";
};
```

### 8.6 `PreferenceMemory`

```ts
export type PreferenceMemory = {
  preferenceId: string;
  label: string;
  sourceSignal: string;
  confidence: "low" | "medium" | "high";
  scope: "session" | "temporary" | "persistent_demo";
  expiresAt?: string;
  viewerVisible: boolean;
  safetyStatus: "allowed" | "blocked";
};
```

### 8.7 `MemoryUpdate`

```ts
export type MemoryUpdate = {
  sessionId: string;
  allowedPreferences: PreferenceMemory[];
  blockedUnsafeLabels: PreferenceMemory[];
  currentMode: "normal" | "low_interruption" | "ad_paused";
};
```

### 8.8 `NextAdDecision`

```ts
export type NextAdDecision = {
  sessionId: string;
  style: "short_utility" | "direct" | "educational" | "paused";
  lengthSeconds: number;
  tone: "direct" | "respectful" | "minimal" | "none";
  categoryRules: string[];
  frequencyRules: string[];
  explanation: string;
};
```

---

## 9. API Contracts

All API routes must validate request and response bodies with shared Zod schemas defined in `packages/core/src/schemas`.

### 9.1 `POST /api/tavus/session`

Creates or retrieves a Tavus CVI session for the current demo.

Request:

```ts
{
  sessionId: string;
  videoContext: VideoContext;
  adCandidate: AdCandidate;
  openingScript: string;
}
```

Response:

```ts
{
  provider: 'tavus' | 'mock';
  sessionId: string;
  tavusConversationUrl?: string;
  tavusConversationId?: string;
  fallbackAgentScript?: string;
  status: 'ready' | 'fallback_ready';
}
```

Failure rule:

- If Tavus fails, return `provider: 'mock'` with `fallbackAgentScript` and `status: 'fallback_ready'`.
- Do not return a 500 for missing Tavus configuration in demo mode.

### 9.2 `POST /api/feedback`

Classifies viewer feedback and returns a safe adaptive response.

Request:

```ts
{
  sessionId: string;
  feedback: ViewerFeedback;
  videoContext: VideoContext;
  adCandidate: AdCandidate;
}
```

Response:

```ts
{
  analysis: FrictionAnalysis;
  agentResponse: AgentResponse;
  memoryUpdate: MemoryUpdate;
}
```

Failure rule:

- If LLM classification fails or `voiceText` is absent, use deterministic local classification from section 10.
- The response must always respect the safety planner.

### 9.3 `GET /api/memory?sessionId=...`

Returns current safe preference memory.

Response:

```ts
{
  sessionId: string;
  preferences: PreferenceMemory[];
  currentMode: 'normal' | 'low_interruption' | 'ad_paused';
  provider: 'redis' | 'memory' | 'local_demo';
}
```

### 9.4 `DELETE /api/memory?sessionId=...`

Clears memory for the current demo session.

Response:

```ts
{
  sessionId: string;
  cleared: true;
}
```

### 9.5 `POST /api/next-ad`

Computes the next ad strategy from context and safe preference memory.

Request:

```ts
{
  sessionId: string;
  videoContext: VideoContext;
  preferences: PreferenceMemory[];
}
```

Response:

```ts
{
  decision: NextAdDecision;
}
```

---

## 10. Deterministic Feedback Mapping

The product must work without LLMs. Implement deterministic mappings first, then optionally enhance with the Anthropic SDK for voice text.

| Signal            | Friction      | Intent         | Required Action                       | Safe Response                                                                          |
| ----------------- | ------------- | -------------- | ------------------------------------- | -------------------------------------------------------------------------------------- |
| `too_long`        | Medium        | Compress       | Shorten                               | `You're right. One line: this helps turn rough ideas into clean demo screens fast.`    |
| `not_relevant`    | High          | Stop and avoid | Stop and update category preference   | `Thanks for the signal. I'll avoid this type of ad next time.`                         |
| `annoyed`         | High          | De-escalate    | Acknowledge, shorten, lower frequency | `Fair. I'll keep this short and stop after one line.`                                  |
| `tell_me_quickly` | Low or Medium | Compress       | Direct utility pitch                  | `Got it. Useful part only: it generates polished demo screens from a rough idea.`      |
| `interested`      | None or Low   | Continue       | Concise next step                     | `Great. The fastest path is to paste your idea and generate three demo-ready screens.` |
| `skip`            | High          | Hard stop      | Stop immediately                      | `No problem. I'll stop here.`                                                          |

Voice text should map to the same signals using keyword and semantic heuristics.

Examples:

- Contains `annoying`, `irritating`, `bro`, `trying to watch`, `leave me`, `stop interrupting` then `annoyed`.
- Contains `quick`, `fast`, `one line`, `hurry` then `tell_me_quickly`.
- Contains `skip`, `stop`, `no thanks`, `not now` then `skip`.
- Contains `not relevant`, `don't need`, `wrong`, `unrelated` then `not_relevant`.
- Contains `interesting`, `tell me more`, `sounds useful` then `interested`.

---

## 11. Safety Guardrail Implementation

### 11.1 Guardrail pipeline

Every feedback event must pass through this pipeline:

```txt
Viewer Feedback
  -> Normalize Signal
  -> Classify Friction
  -> Generate Candidate Response
  -> Safety Policy Check
  -> Create Allowed Memory Update
  -> Block Unsafe Memory
  -> Return UI-Visible Decision
```

### 11.2 Safety policy checks

Backend must reject or rewrite responses that:

- Increase pressure after negative feedback.
- Use guilt, fear, shame, anxiety, or urgency as manipulation.
- Infer sensitive traits.
- Store sensitive labels.
- Claim the system knows hidden emotions beyond explicit feedback.
- Continue after hard skip.
- Hide memory from the viewer.

### 11.3 Required pure functions

Implement these in `packages/core/src`:

```ts
classifyFeedback(feedback: ViewerFeedback): FrictionAnalysis
planSafeResponse(input: {
  analysis: FrictionAnalysis;
  videoContext: VideoContext;
  adCandidate: AdCandidate;
}): AgentResponse
createMemoryUpdate(input: {
  sessionId: string;
  feedback: ViewerFeedback;
  analysis: FrictionAnalysis;
}): MemoryUpdate
selectNextAd(input: {
  sessionId: string;
  videoContext: VideoContext;
  preferences: PreferenceMemory[];
}): NextAdDecision
validateSafety(input: {
  response: AgentResponse;
  memoryUpdate: MemoryUpdate;
}): {
  safe: boolean;
  modifiedResponse?: AgentResponse;
  blockedLabels: PreferenceMemory[];
}
```

All of these must be unit tested. None of them may call the LLM. Safety must be deterministic.

---

## 12. Tavus Integration Requirements

### 12.1 Tavus CVI Endpoint

The specific Tavus product is the Conversational Video Interface (CVI). Verify exact field names with Tavus docs at integration time. The Tavus team is on-site at the hackathon.

Endpoint:

```
POST https://tavusapi.com/v2/conversations
```

Headers:

```
x-api-key: <TAVUS_API_KEY>
Content-Type: application/json
```

Body:

```json
{
  "replica_id": "<TAVUS_REPLICA_ID>",
  "persona_id": "<TAVUS_PERSONA_ID>",
  "conversation_name": "ad-demo-<sessionId>",
  "conversational_context": "<opening pitch plus safety system prompt>",
  "properties": {
    "max_call_duration": 180,
    "enable_recording": false
  }
}
```

Response contains:

- `conversation_id`
- `conversation_url`
- `status`

The frontend embeds `conversation_url` in an iframe. The backend job ends at returning that URL through `/api/tavus/session`.

Use raw `fetch` against the Tavus REST API. Do not install a Tavus SDK package.

### 12.2 Provider abstraction

Create a Tavus provider interface instead of calling Tavus directly from UI components.

```ts
export interface TavusProvider {
  createSession(input: TavusSessionInput): Promise<TavusSessionResult>;
  endSession(sessionId: string): Promise<void>;
}
```

Implementations:

- `RealTavusProvider` in `packages/integrations/src/tavus/realProvider.ts`
- `MockTavusProvider` in `packages/integrations/src/tavus/mockProvider.ts`

Selection rule:

- Use `RealTavusProvider` only when Tavus env vars are present and `NEXT_PUBLIC_TAVUS_ENABLED=true`.
- Otherwise use `MockTavusProvider`.

### 12.3 Tavus persona behavior

The Tavus agent should follow this behavior:

System style:

- Calm.
- Direct.
- Respectful.
- Short.
- Utility-first.
- Never manipulative.

Opening pitch:

```txt
Hey, I see you're watching a hackathon build video. I'll keep this short. If you're trying to turn a rough idea into a polished demo, this tool helps you create investor-ready mockups in minutes.
```

De-escalation rule:

```txt
If the viewer sounds annoyed, rushed, uninterested, or asks to skip, acknowledge once, shorten or stop, and do not continue persuasion.
```

### 12.4 Tavus UI fallback

When Tavus is unavailable, the UI must still show:

- Agent video container or avatar placeholder.
- Current agent script.
- Provider badge: `Demo fallback active`, positioned top-right of the agent card.
- No broken iframe.
- No uncaught console error.

---

## 13. Redis Memory Requirements

### 13.1 Client

Use `@upstash/redis` only.

```ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

### 13.2 Keys

Use namespaced keys.

```txt
ad-demo:session:{sessionId}
ad-demo:preferences:{sessionId}
ad-demo:feedback:{sessionId}
ad-demo:next-ad:{sessionId}
```

### 13.3 TTL

For the MVP, use short-lived demo memory.

- Session state: 2 hours.
- Feedback events: 2 hours.
- Preference memory: 24 hours or session-only depending on demo setting.
- Next-ad decision: 2 hours.

### 13.4 Fallback memory

If Upstash Redis is unavailable:

- Server uses in-memory map for the active runtime.
- Client mirrors latest visible memory in localStorage.
- UI clearly says `Demo memory active` instead of failing.

Never block the demo because Redis is down.

---

## 14. Optional ElevenLabs Requirements

ElevenLabs is optional and must not become a dependency for the core demo.

Use it only for:

- Additional voice polish.
- TTS playback of adaptive response.
- Backup voice if Tavus voice interaction is not available.

Rules:

- Hide ElevenLabs UI if no API key is present.
- Do not delay the main feedback loop while waiting for TTS generation.
- Button feedback must remain the primary reliable interaction.
- ElevenLabs failures must degrade silently with a small non-blocking UI status.

---

## 15. Frontend Quality Bar

### 15.1 UI principles

The UI should feel like a premium startup demo, not a generic dashboard.

Target feel:

- Cinematic but not arcade-like.
- Dark, minimal, serious, high-trust.
- Strong visual hierarchy.
- Clear demo story.
- Tavus agent as the center of the ad experience.
- Transparent memory as a trust layer.

Avoid:

- Random bright colors.
- Overcrowded panels.
- Dashboard clutter.
- Fake complexity.
- Hidden state changes.
- UI that makes the safety layer feel like an afterthought.

### 15.2 Required frontend states

Every major UI section must support:

- Initial state.
- Loading state.
- Success state.
- API fallback state.
- Error state.
- Empty state.

### 15.3 Accessibility

Minimum requirements:

- Buttons have accessible labels.
- Keyboard navigation works for reaction buttons.
- Focus states are visible.
- Sufficient contrast.
- Motion respects reduced-motion preferences.
- No important state is conveyed only through color.

### 15.4 Browser compatibility

- Buttons must cover the full demo flow on all modern browsers.
- Voice input via `SpeechRecognition` is Chrome and Edge only. On Safari and Firefox, hide the voice input with a clear note: `Voice input not supported in this browser. Use buttons.`

### 15.5 State management

Use a simple state machine for the demo flow.

Recommended states:

```ts
type DemoStage =
  | "landing"
  | "video_context"
  | "agent_intro"
  | "pitch"
  | "feedback"
  | "analysis"
  | "adaptive_response"
  | "memory_update"
  | "next_ad_decision";
```

Do not scatter demo stage logic across unrelated components.

---

## 16. Backend Quality Bar

### 16.1 Provider resilience

Every provider call must have:

- Timeout (use `PROVIDER_TIMEOUT_MS`).
- Typed error handling.
- Fallback result.
- Structured logging.
- No secret leakage.

### 16.2 Validation

- Validate every API request with Zod schemas from `packages/core/src/schemas`.
- Validate every provider response before returning to UI.
- Reject invalid user-controlled input safely.
- Never trust client-provided memory updates without server-side safety checks.

### 16.3 Pure business logic

Classifier, response planner, memory guardrails, and next-ad selector must be implemented as pure functions where possible.

Benefits:

- Easy unit tests.
- Easy offline demo.
- No dependency on LLM for correctness.
- No hidden behavior.

### 16.4 Error handling

Do not throw raw provider errors to the UI.

Return safe typed errors:

```ts
{
  ok: false,
  code: 'PROVIDER_UNAVAILABLE' | 'VALIDATION_ERROR' | 'SAFETY_BLOCKED' | 'UNKNOWN',
  message: string,
  fallbackUsed: boolean
}
```

For demo-critical routes, prefer fallback success responses over hard failures.

---

## 17. Testing Requirements

### 17.1 Required unit tests

Test these behaviors:

- Each feedback button maps to the correct `FrictionAnalysis`.
- Negative feedback never produces stronger persuasion.
- `skip` always stops the agent.
- Unsafe memory labels are blocked.
- Allowed preference memory is visible and correctly scoped.
- Next-ad decision becomes shorter or lower frequency after annoyance.
- Tavus provider falls back to mock when missing config.
- Upstash provider falls back to in-memory when unavailable.

### 17.2 Required integration tests

Test full API behavior:

- `/api/tavus/session` returns mock provider in demo mode.
- `/api/feedback` returns analysis, safe response, and memory update.
- `/api/memory` returns stored or fallback preferences.
- `/api/next-ad` reflects memory changes.

### 17.3 Optional E2E tests

If Playwright or equivalent is present:

- Landing then Start Demo then Context then Agent then Annoyed then Memory then Next Ad.
- Skip path stops the ad immediately.
- API fallback mode still completes the demo.

---

## 18. Commands

The repo uses `pnpm`.

Common commands:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Before final handoff, run the strongest available checks:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

If a command fails because setup is incomplete, report exactly what failed and why. Do not pretend it passed.

---

## 19. Code Style Rules

### 19.1 TypeScript

- Use strict TypeScript.
- Avoid `any`.
- Prefer discriminated unions for state and provider results.
- Keep domain types in `packages/core/src/schemas`.
- Use explicit return types for exported functions.
- Use `async/await` with clear error boundaries.

### 19.2 React

- Keep components focused.
- Keep business logic out of presentational components.
- Use server components by default where appropriate.
- Mark client components deliberately with `'use client'`.
- Avoid prop drilling when a small context or state machine is cleaner.
- Do not create giant all-in-one components.

### 19.3 Styling

- Prefer design tokens and reusable primitives via shadcn/ui.
- Avoid one-off inconsistent spacing.
- Do not hardcode random colors across files.
- Keep dark mode intentional and accessible.
- Remove unused CSS and classes when replacing UI.

### 19.4 API and backend

- Keep provider code isolated.
- Keep route handlers thin.
- Keep domain logic testable.
- Never expose secrets in client bundles.
- Never log API keys or full provider error payloads.

---

## 20. File Editing Discipline

When asked to make an edit:

1. Inspect current repo structure.
2. Identify the canonical existing file for the change.
3. Edit the canonical file.
4. Remove replaced code.
5. Remove stale imports.
6. Remove duplicate files created by earlier attempts.
7. Update tests and docs.
8. Run checks.
9. Summarize changed files and verification results.

Never do this:

```txt
components/AgentPanel.tsx
components/AgentPanelNew.tsx
components/AgentPanelFinal.tsx
components/AgentPanelV2.tsx
```

Do this instead:

```txt
components/tavus/AgentPanel.tsx
```

If a new file is necessary, it must have a clear architectural reason and must fit the existing folder structure.

---

## 21. Demo Fixtures

The demo should include deterministic fixtures so it is stable for judges. Location: `packages/core/src/fixtures`.

### 21.1 Video fixture

```ts
export const demoVideoContext: VideoContext = {
  id: "startup-demo-24h",
  title: "How to build a startup demo in 24 hours",
  topic: "Startup demo building",
  tags: ["startup", "hackathon", "demo", "product design", "builder workflow"],
  transcriptSnippet:
    "In this tutorial, we turn a rough product idea into a polished startup demo with clear screens, pitch flow, and launch-ready storytelling.",
  viewerMode: "focused",
  interruptionRisk: "high",
  recommendedAdStyle: "short_utility",
};
```

### 21.2 Ad fixture

```ts
export const demoAdCandidate: AdCandidate = {
  id: "demo-screen-builder",
  productName: "LaunchFrame AI",
  category: "Developer or design tool",
  pitchAngle: "Create polished demo screens from a rough product idea.",
  defaultLengthSeconds: 20,
  relevanceReason:
    "The viewer is watching a hackathon or startup demo-building video and may need fast demo assets.",
};
```

### 21.3 Feedback fixture

```ts
export const annoyedFeedback: ViewerFeedback = {
  id: "feedback-annoyed-001",
  sessionId: "demo-session-001",
  buttonSignal: "annoyed",
  voiceText: "Bro, I'm trying to watch the video. This is annoying.",
  timestamp: new Date().toISOString(),
};
```

---

## 22. Build Phases

Time budget assumes a hackathon window. Adjust based on actual pace. Stop and reassess if any block runs more than 30 percent over.

### Phase 1: Static demo story (target: 2 hours)

Exit criteria:

- Landing page works.
- Fake YouTube page works.
- Context panel works.
- Scripted Tavus or mock agent appears.
- Demo can click through the story without APIs.

### Phase 2: Interactive feedback loop (target: 3 hours)

Exit criteria:

- Six feedback buttons work.
- Each signal produces different analysis.
- Each signal produces safe adaptive response.
- UI clearly shows changed strategy.

### Phase 3: Memory and next-ad decision (target: 3 hours)

Exit criteria:

- Upstash Redis or fallback memory stores safe preferences.
- Memory panel shows allowed and blocked memory.
- Clear memory works.
- Next-ad screen changes based on memory.

### Phase 4: Tavus integration polish (target: 4 hours)

Exit criteria:

- Tavus CVI session creation works when configured.
- Mock Tavus fallback works when not configured.
- Agent feels central to the experience.
- Tavus failures do not break the demo.

### Phase 5: Safety proof and demo polish (target: 2 hours)

Exit criteria:

- Blocked unsafe memory examples are visible.
- Low-interruption mode works.
- Demo completes in under 90 seconds.
- Full presentation can be done in under 3 minutes.
- README is written with the pitch, demo flow, and getting-started instructions.

---

## 23. Acceptance Criteria

The project is acceptable only when all P0 criteria are true:

- User can start the demo from the landing page.
- Fake YouTube-style video page is believable.
- Context panel explains the video topic, viewer mode, ad opportunity, risk, and recommended style.
- Tavus or Tavus fallback agent delivers the contextual pitch.
- Six reaction buttons work.
- Optional voice does not break the core flow.
- Feedback is classified into friction, intent, risk, and action.
- Negative feedback causes shorter and lower-pressure behavior.
- Skip stops immediately.
- Safe preference memory is shown transparently.
- Unsafe memory examples are blocked.
- Next-ad decision becomes shorter, more direct, and lower interruption after annoyance.
- Upstash Redis is used when available.
- Fallback memory works when Redis is unavailable.
- Tavus CVI is used when available.
- Tavus fallback works when Tavus is unavailable.
- README exists at the repo root with pitch, demo flow, and getting-started.
- Build passes lint, typecheck, and tests, or failures are clearly documented.

---

## 24. Handoff Format

Every coding agent must end its work with a concise handoff:

```txt
Summary:
- What changed.

Files changed:
- path/to/file.ts: why it changed.

Verification:
- pnpm lint: pass/fail/not run, reason.
- pnpm typecheck: pass/fail/not run, reason.
- pnpm test: pass/fail/not run, reason.
- pnpm build: pass/fail/not run, reason.

Fallback behavior checked:
- Tavus missing config: pass/fail/not checked.
- Redis missing config: pass/fail/not checked.
- LLM missing config: pass/fail/not checked.

Notes and risks:
- Anything the next agent must know.
```

Never claim success without running or honestly reporting checks.

---

## 25. README Requirement

A `README.md` must exist at the repo root before the demo ships. It contains:

1. The final product pitch from section 26.
2. A 60-second demo flow walkthrough.
3. Getting started: env setup, `pnpm install`, `pnpm dev`.
4. The locked stack table (Tavus CVI, Upstash Redis, Anthropic Haiku 4.5).
5. A note on safety: transparent memory, deterministic safety planner, blocked unsafe label examples.

The README is what judges read first. It must read like a product, not a hackathon scratchpad.

---

## 26. Final Product Pitch To Preserve

Use this pitch consistently across UI, README, and demo narration:

```txt
Today, ads interrupt people without understanding the moment they are in. We built an interactive Tavus ad agent that understands the video context, listens to viewer feedback, adapts its pitch, and stores transparent preference memory so future ads become less annoying and more useful. The goal is not emotional manipulation. The goal is respectful, viewer-controlled advertising.
```

---

## 27. Final Instruction To All Agents

Build the smallest complete product that proves the full loop:

```txt
Video Context -> Tavus Pitch -> Viewer Feedback -> Friction Detection -> Safe Response -> Redis Memory -> Better Next Ad
```

Prioritize demo reliability, safety clarity, and product storytelling over unnecessary platform complexity.

Do not leave messy code behind. Do not create duplicate versions. Do not hide failed integrations. Do not let external APIs decide whether the demo works.

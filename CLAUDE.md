# CLAUDE.md

## Read This First

`AGENTS.md` at the repo root is the canonical spec for this project. Read it in full before any work in this repo. This file is supplementary and focused on:

1. Backend ownership boundaries for Claude Code on a two-person team.
2. Locked-in stack decisions (Redis client, LLM provider, Tavus endpoint) that resolve open choices in AGENTS.md.
3. First-action checklist for verifying the existing Next.js scaffold.
4. Anti-patterns specific to this build.

Where this file conflicts with AGENTS.md, this file wins for backend implementation details. AGENTS.md wins for product behavior, safety rules, acceptance criteria, and demo flow.

---

## Your Role

You are the Claude Agent described in AGENTS.md section 2.2. You own the backend on a two-person team. Codex owns the frontend.

**In scope:**

- API routes under `apps/web/app/api/*`
- Provider adapters in `packages/integrations/src/*` (Tavus, Upstash Redis, Anthropic, optional ElevenLabs)
- Domain logic, schemas, safety, classifier, response planner in `packages/core/src/*`
- Backend unit tests and API integration tests
- `.env.example` maintenance for backend variables

**Out of scope (Codex owns):**

- Page layouts, components, styling, animations
- The frontend demo state machine
- Tavus iframe embedding inside React components
- shadcn/ui setup or component composition

**Coordination rule:** expose stable typed contracts in `packages/core/src/schemas`. Codex consumes these. Do not change a contract silently. If a change is breaking, leave the old type alias for one commit and call it out in the handoff.

---

## First Actions (In Order)

The Next.js scaffolding already exists. Your first job is to verify state, not to scaffold.

### 1. Confirm repo state

```bash
pwd && ls -la
find . -maxdepth 3 -type f -name "package.json" -not -path "*/node_modules/*" | sort
cat package.json
```

If `apps/web` and `packages/core` do not exist yet, stop and ask the human before restructuring. The expected shape is in AGENTS.md section 4.

### 2. Inventory existing dependencies

```bash
cat apps/web/package.json 2>/dev/null
cat packages/core/package.json 2>/dev/null
cat packages/integrations/package.json 2>/dev/null
```

### 3. Install missing backend dependencies

Required backend libraries. Add only the ones missing from the inventory above:

```bash
pnpm add zod @upstash/redis @anthropic-ai/sdk
pnpm add -D vitest @types/node tsx
```

**Do not install:** `ioredis`, `redis`, `openai`, `@vercel/kv`, `langchain`, or any second LLM SDK. The stack is locked. See the next section.

### 4. Confirm baseline is green

```bash
pnpm typecheck && pnpm lint
```

If either fails on the baseline scaffold, fix the baseline before writing new code. Do not commit on top of a broken baseline.

### 5. Read the AGENTS.md inspection protocol before any edit

AGENTS.md section 3 lists the `grep` commands to run before creating new files. Run them. The most common failure on this kind of project is creating `ServiceV2.ts` when `Service.ts` already exists.

---

## Locked Stack Decisions

These resolve the open choices in AGENTS.md sections 5.3 and 6. Treat them as final unless the human explicitly overrides.

### Redis: Upstash REST

Use `@upstash/redis` only.

- Works on Vercel edge and serverless out of the box.
- REST-based. No connection pooling drama.
- Redis is a hackathon sponsor and Upstash is their managed offering.

Env vars (these are the only Redis vars):

```
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_REDIS_ENABLED=false
```

Delete `REDIS_URL` and `REDIS_TOKEN` from `.env.example` if they are still there. They imply ioredis and we are not using ioredis.

Provider adapter location: `packages/integrations/src/redis/upstashProvider.ts` with a `MemoryProvider` interface and `InMemoryProvider` fallback in the same folder.

### LLM: Claude Haiku 4.5 via Anthropic SDK

Use `@anthropic-ai/sdk` with model id `claude-haiku-4-5-20251001`. Reasoning:

- Cheap. Strong price-performance for short classification tasks.
- Fast enough for sub-second feedback classification inside the demo loop.
- Good at emotional nuance from short text inputs, which is the classifier's whole job.

Env vars:

```
ANTHROPIC_API_KEY
LLM_MODEL=claude-haiku-4-5-20251001
NEXT_PUBLIC_LLM_ENABLED=false
```

Rename `LLM_API_KEY` and `LLM_PROVIDER` in `.env.example`. We commit to one provider. The generic abstraction adds complexity we do not need at hackathon scale.

**LLM is used for:**

1. Voice text classification when the input is free text rather than a button.
2. Optional response polish on top of deterministic planner output, gated by `NEXT_PUBLIC_LLM_ENABLED`.

**LLM is never used for:**

1. Memory safety decisions. Safety is deterministic Zod-validated logic in `packages/core/src/safety`.
2. Any required correctness path. The deterministic classifier from AGENTS.md section 10 is the source of truth. The LLM is an optional enhancement.

### Tavus: Conversational Video Interface (CVI)

The product to integrate is Tavus CVI. The Tavus team is on-site at the hackathon and can confirm exact payload shapes. Verify against current docs before the first live test.

Endpoint:

```
POST https://tavusapi.com/v2/conversations
```

Headers:

```
x-api-key: <TAVUS_API_KEY>
Content-Type: application/json
```

Body (verify field names with Tavus docs at integration time):

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

Response includes `conversation_id` and `conversation_url`. The frontend embeds `conversation_url` in an iframe. Your job ends at returning that URL from `/api/tavus/session` per AGENTS.md section 9.1.

Use raw `fetch` rather than installing a Tavus SDK. Smaller surface area, fewer surprises.

---

## Backend Anti-Patterns

1. Do not call the LLM inside the safety planner. Safety is deterministic and must be testable without network.
2. Do not write provider results to Redis without running the schema validator first.
3. Do not return a 500 from any demo-critical route. Return a typed fallback per AGENTS.md section 16.4.
4. Do not log raw provider error payloads. Strip keys and full bodies before logging.
5. Do not introduce a second Redis or LLM client. The stack is locked above.
6. Do not redesign frontend screens. If the frontend needs a new field on a response, add it to the schema in `packages/core/src/schemas`, return it from the route, and note it in the handoff.
7. Do not leave duplicate adapter files like `tavusProvider.ts` and `tavusProviderNew.ts`. Edit in place per AGENTS.md section 20.
8. Do not store anything in Redis that is not in the `PreferenceMemory` schema. Sensitive label blocking happens before the write, not after.

---

## Hackathon Time Budget

Backend work only. Adjust based on actual pace, but stop and reassess if any block runs more than 30 percent over.

| Block                                                     | Hours  | Output                                                                                             |
| --------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| 1. Repo verification, env, schemas, fixtures              | 1      | All types in `packages/core/src/schemas`, fixtures in `packages/core/src/fixtures`, baseline green |
| 2. Pure functions: classifier, planner, memory guardrails | 2 to 3 | The five functions in AGENTS.md section 11.3 with unit tests passing                               |
| 3. API routes with deterministic fallback                 | 2      | `/api/feedback`, `/api/memory`, `/api/next-ad` working without external providers                  |
| 4. Tavus provider adapter and `/api/tavus/session`        | 2      | Real Tavus path and mock fallback both working                                                     |
| 5. Upstash provider adapter and Redis wiring              | 1      | Real Redis path and in-memory fallback both working                                                |
| 6. Anthropic LLM adapter for voice-text classification    | 1      | Voice path classified end to end, deterministic fallback intact                                    |
| 7. Integration tests across all four routes               | 1      | Each route tested under both real-provider and fallback paths                                      |
| 8. Buffer for Codex integration issues and demo polish    | 2      | Demo flows cleanly end to end                                                                      |

Total: 12 to 13 backend hours. If your hackathon block is shorter, drop block 6 first, then block 7.

---

## Working With Codex

Codex owns the frontend. Communicate through shared schemas, not through comments in shared files.

**When you change a backend contract:**

1. Update the type in `packages/core/src/schemas` first.
2. Update the route handler that returns it.
3. If the change is breaking, add a deprecation type alias for one commit so Codex has a migration window.
4. Note the exact type diff in your handoff.

**When Codex needs a new endpoint:**

- They open an issue or write a frontend stub in `apps/web/lib/clients` with the expected shape.
- You implement the real route against that shape.
- You do not modify their stub. They delete it once your route is live.

**Schema authority:** `packages/core/src/schemas` is the single source of truth. If a type appears in two places, the version in `packages/core/src/schemas` wins and the other version gets deleted in the same commit.

---

## Cursor Backup Protocol

If you hit Claude rate limits and the user switches you to Cursor for backend continuation:

1. Cursor reads `AGENTS.md` and `CLAUDE.md` first.
2. Cursor runs the inspection commands in AGENTS.md section 3 before any edit.
3. Cursor patches in place. No new file versions. No parallel implementations.
4. Cursor produces the same handoff format described in AGENTS.md section 24.

Cursor is a continuation agent, not a fresh start. It must respect prior architecture choices and the locked stack above.

---

## Handoff Checklist (Backend Specific)

After every unit of work, output the AGENTS.md section 24 handoff. In addition, for backend work include:

- **Schemas changed:** list each type with before and after signatures.
- **Routes touched:** list each route with the new response shape.
- **Provider failure paths:** confirm each touched provider was tested with its env var missing.
- **Redis key changes:** list any new key namespaces or TTL changes.
- **Safety regressions checked:** confirm no negative-feedback path increases pressure and no unsafe label can reach Redis.

Never claim a check passed without running it. If you did not run `pnpm test`, say so.

---

## Final Note

Build the smallest correct backend that lets the frontend complete the full loop in AGENTS.md section 26. Safety is a feature, not a checkbox. Memory transparency is the trust layer that distinguishes this product from the ad systems it critiques. Do not skip the blocked-unsafe-memory examples. Judges will look for them, and so will the sponsors evaluating whether Tavus, Redis, and ElevenLabs are being used responsibly.

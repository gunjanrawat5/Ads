import type { ArcEntry, PreferenceMemory } from "@ads/core";
import { InMemoryProvider } from "./inMemoryProvider";

const DEFAULT_BASE_URL = "http://localhost:8000";

const ARC_TEXT_PATTERN = /^Ad (\d+) \((.+)\): viewer was (.+)$/;

interface WorkingMemoryResponse {
  messages?: unknown[];
  memories?: Array<{ text?: string; created_at?: string; timestamp?: string }>;
}

interface LongTermSearchResponse {
  memories?: Array<{ text?: string; id?: string }>;
  results?: Array<{ text?: string; id?: string; memory?: { text?: string; id?: string } }>;
}

export interface AgentMemoryProviderOptions {
  baseUrl?: string;
  token?: string;
}

/**
 * Redis Agent Memory Server provider. Uses fetch against REDIS_AGENT_MEMORY_URL
 * for working memory (arc entries) and long-term memory (preferences). Session
 * state (feedback log, interruption mode, next-ad cache) stays on a process-local
 * sidecar so routes that were not migrated still work when the agent server is
 * enabled.
 */
export class AgentMemoryProvider {
  readonly name = "redis_agent_memory" as const;
  private readonly baseUrl: string;
  private readonly token: string | undefined;
  private readonly session = new InMemoryProvider();

  constructor(options: AgentMemoryProviderOptions = {}) {
    this.baseUrl = (
      options.baseUrl ??
      process.env.REDIS_AGENT_MEMORY_URL ??
      DEFAULT_BASE_URL
    ).replace(/\/$/, "");
    this.token = options.token ?? process.env.REDIS_AGENT_MEMORY_TOKEN;
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async storeArcEntry(sessionId: string, entry: ArcEntry): Promise<void> {
    const url = `${this.baseUrl}/v1/working-memory/${encodeURIComponent(sessionId)}`;
    let existing: WorkingMemoryResponse = { messages: [], memories: [] };

    const getRes = await fetch(url, { headers: this.headers() });
    if (getRes.ok) {
      existing = (await getRes.json()) as WorkingMemoryResponse;
    } else if (getRes.status !== 404) {
      throw new Error(`GET working-memory failed: ${getRes.status}`);
    }

    const body = {
      messages: existing.messages ?? [],
      memories: [
        ...(existing.memories ?? []),
        {
          text: `Ad ${entry.adIndex} (${entry.adCategory}): viewer was ${entry.emotionSignal}`,
          memory_type: "episodic",
          topics: ["ad_reaction", entry.adCategory],
          session_id: sessionId,
        },
      ],
    };

    const putRes = await fetch(url, {
      method: "PUT",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!putRes.ok) {
      throw new Error(`PUT working-memory failed: ${putRes.status}`);
    }
  }

  async getArcEntries(sessionId: string): Promise<ArcEntry[]> {
    const url = `${this.baseUrl}/v1/working-memory/${encodeURIComponent(sessionId)}`;
    const res = await fetch(url, { headers: this.headers() });
    if (res.status === 404) return [];
    if (!res.ok) {
      throw new Error(`GET working-memory failed: ${res.status}`);
    }

    const data = (await res.json()) as WorkingMemoryResponse;
    const entries: ArcEntry[] = [];

    for (const memory of data.memories ?? []) {
      const text = memory.text ?? "";
      const match = ARC_TEXT_PATTERN.exec(text);
      if (!match) continue;
      entries.push({
        adIndex: Number.parseInt(match[1], 10),
        adCategory: match[2],
        emotionSignal: match[3],
        timestamp: memory.timestamp ?? memory.created_at ?? "",
      });
    }

    return entries;
  }

  async storePreference(
    sessionId: string,
    pref: PreferenceMemory,
  ): Promise<void> {
    if (pref.safetyStatus !== "allowed") return;

    const url = `${this.baseUrl}/v1/long-term-memory`;
    const body = {
      memories: [
        {
          text: pref.label,
          memory_type: "semantic",
          topics: ["ad_preference"],
          session_id: sessionId,
          user_id: sessionId,
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`POST long-term-memory failed: ${res.status}`);
    }
  }

  async getPreferences(sessionId: string): Promise<PreferenceMemory[]> {
    const url = `${this.baseUrl}/v1/long-term-memory/search`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        text: "ad preference",
        session_id: sessionId,
        limit: 20,
      }),
    });
    if (res.status === 404) return [];
    if (!res.ok) {
      throw new Error(`POST long-term-memory/search failed: ${res.status}`);
    }

    const data = (await res.json()) as LongTermSearchResponse;
    const rawResults =
      data.memories ??
      data.results?.map((result) => result.memory ?? result) ??
      [];

    return rawResults.map((memory, index) => ({
      preferenceId: memory.id ?? `agent-memory-pref-${sessionId}-${index}`,
      label: memory.text ?? "",
      sourceSignal: "agent_memory",
      confidence: "medium" as const,
      scope: "session" as const,
      viewerVisible: true,
      safetyStatus: "allowed" as const,
    }));
  }

  async appendFeedback(
    sessionId: string,
    feedback: Parameters<InMemoryProvider["appendFeedback"]>[1],
  ): Promise<void> {
    return this.session.appendFeedback(sessionId, feedback);
  }

  async getSessionMode(
    sessionId: string,
  ): Promise<Awaited<ReturnType<InMemoryProvider["getSessionMode"]>>> {
    return this.session.getSessionMode(sessionId);
  }

  async setSessionMode(
    sessionId: string,
    mode: Parameters<InMemoryProvider["setSessionMode"]>[1],
  ): Promise<void> {
    return this.session.setSessionMode(sessionId, mode);
  }

  async saveNextAdDecision(
    sessionId: string,
    decision: Parameters<InMemoryProvider["saveNextAdDecision"]>[1],
  ): Promise<void> {
    return this.session.saveNextAdDecision(sessionId, decision);
  }

  async clear(sessionId: string): Promise<void> {
    return this.session.clear(sessionId);
  }
}

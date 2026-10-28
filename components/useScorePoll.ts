"use client";

import { useEffect, useState } from "react";
import { MESSAGES, SCORE_GIVE_UP_MS, pollScore, type ScoreState } from "@/lib/score";

export type Waiting = { token: string; queuedAhead: number; pollAfterMs: number; startedAt: number };

/**
 * Polls a pending score until it is done or has failed, and gives up (with the
 * "slow" sentence) after SCORE_GIVE_UP_MS. Also ticks once a second, so the
 * progress line can follow the elapsed time.
 */
export function useScorePoll(waiting: Waiting | null, onSettled: (state: ScoreState) => void) {
  // The queue position of the last poll, kept with its token so a new request starts from its own.
  const [polled, setPolled] = useState<{ token: string; queuedAhead: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!waiting) return;
    const { token, startedAt } = waiting;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = setInterval(() => setNow(Date.now()), 1_000);

    async function poll(delay: number) {
      timer = setTimeout(async () => {
        if (cancelled) return;
        if (Date.now() - startedAt > SCORE_GIVE_UP_MS) {
          onSettled({ kind: "failed", error: "slow", message: MESSAGES.slow });
          return;
        }
        const state = await pollScore(token);
        if (cancelled) return;
        if (state.kind === "pending") {
          setPolled({ token, queuedAhead: state.queuedAhead });
          void poll(state.pollAfterMs);
        } else {
          onSettled(state);
        }
      }, delay);
    }
    void poll(waiting.pollAfterMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(tick);
    };
    // onSettled is a setter from the caller; the poll restarts only for a new token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting]);

  const queuedAhead = waiting && polled?.token === waiting.token ? polled.queuedAhead : (waiting?.queuedAhead ?? 0);
  return { queuedAhead, elapsedMs: waiting ? Math.max(0, now - waiting.startedAt) : 0 };
}

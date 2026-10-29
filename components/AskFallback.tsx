"use client";

import { useState } from "react";
import AskForm from "@/components/AskForm";
import type { AskOutcome } from "@/lib/ask";

const COPY = {
  title: "Vill ni ändå ha ett förslag?",
  text: "Ni kan be om ett gratis förslag på en ny hemsida även utan poängen. Förslaget är helt utan förpliktelse.",
} as const;

/** Flow A of the plan: the score is unavailable, so the visitor asks with the web address alone. */
export default function AskFallback({ url }: { url: string }) {
  const [asked, setAsked] = useState<Extract<AskOutcome, { ok: true }> | null>(null);
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    host = "";
  }

  return (
    <div className="score-offer">
      <h3>{COPY.title}</h3>
      {asked ? (
        <p aria-live="polite">{asked.message}</p>
      ) : (
        <>
          <p>{COPY.text}</p>
          <AskForm target={{ url }} host={host} onAsked={setAsked} />
        </>
      )}
    </div>
  );
}

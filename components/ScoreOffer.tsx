"use client";

import { useState } from "react";
import AskForm from "@/components/AskForm";
import { useProposalPoll } from "@/components/useScorePoll";
import { ASK_ENABLED, type AskOutcome } from "@/lib/ask";
import type { ScoreResult } from "@/lib/score";
import { mailto } from "@/lib/site";

const COPY = {
  title: "Vill ni se hur en ny hemsida kan se ut?",
  titleProposal: "Ert förslag",
  text: "Vi bygger ett gratis förslag utifrån ert eget innehåll. Förslaget är helt utan förpliktelse.",
  mailButton: "Mejla oss om ett förslag",
  mailSubject: (host: string) => `Förslag på ny hemsida för ${host}`,
  building: "Vi bygger förslaget nu. Det tar några minuter, och det visas här när det är klart.",
  ready: "Förslaget är klart.",
  open: "Öppna förslaget",
  stopped: "Förslaget kunde inte byggas den här gången.",
  slow: "Förslaget är inte klart än. Ladda om sidan om en stund, så finns det här.",
} as const;

type Props = { result: ScoreResult; onResult: (result: ScoreResult) => void };

/** What follows a score: the demo if one is on its way, else the ask form, else a mail link. */
export default function ScoreOffer({ result, onResult }: Props) {
  const [asked, setAsked] = useState<Extract<AskOutcome, { ok: true }> | null>(null);
  const host = result.host || result.url;
  const proposal = result.proposal;
  const waitForDemo = proposal?.status === "building" || (asked?.approved === true && proposal === null);
  const { gaveUp } = useProposalPoll(waitForDemo ? result.token : null, onResult);

  let body;
  if (proposal?.status === "ready") {
    body = (
      <>
        <p>{COPY.ready}</p>
        <a className="btn btn-primary" href={proposal.url} target="_blank" rel="noopener">
          {COPY.open}
        </a>
      </>
    );
  } else if (proposal?.status === "stopped") {
    body = <p>{COPY.stopped}</p>;
  } else if (waitForDemo) {
    body = (
      <p className="score-waiting" aria-live="polite">
        {!gaveUp && <span className="spinner" aria-hidden="true" />}
        {gaveUp ? COPY.slow : proposal?.status === "building" && proposal.step ? `${proposal.step} …` : COPY.building}
      </p>
    );
  } else if (asked) {
    body = <p aria-live="polite">{asked.message}</p>;
  } else if (ASK_ENABLED && result.canAsk) {
    body = (
      <>
        <p>{COPY.text}</p>
        <AskForm target={{ token: result.token }} host={result.host} onAsked={setAsked} />
      </>
    );
  } else {
    body = (
      <>
        <p>{COPY.text}</p>
        <a className="btn btn-primary" href={mailto(COPY.mailSubject(host))}>
          {COPY.mailButton}
        </a>
      </>
    );
  }

  return (
    <div className="score-offer">
      <h3>{proposal || waitForDemo ? COPY.titleProposal : COPY.title}</h3>
      {body}
    </div>
  );
}

import Link from "next/link";
import type { ScoreResult as Result } from "@/lib/score";
import { mailto } from "@/lib/site";

const COPY = {
  outOf: "av 100",
  scoreFor: "Poäng för",
  findingsTitle: "Det här såg granskningen",
  noFindings: (checks: string) => `Granskningen hittade inget att anmärka på i de ${checks} kontrollerna.`,
  caveat: (checks: string) =>
    `Poängen bygger på ${checks} automatiska kontroller av startsidan. Den säger vad granskningen såg, inte något om ert företag.`,
  offerTitle: "Vill ni se hur en ny hemsida kan se ut?",
  offerText: "Vi bygger ett gratis förslag utifrån ert eget innehåll. Förslaget är helt utan förpliktelse.",
  offerButton: "Mejla oss om ett förslag",
  offerSubject: (host: string) => `Förslag på ny hemsida för ${host}`,
  again: "Granska en annan webbplats",
} as const;

type Props = { result: Result; onAgain: () => void };

const NUMBER_WORDS = ["noll", "en", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio"];

/** The number of checks in words ("sex", "sju"): the API sends six or seven categories. */
function checkCount(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export default function ScoreResult({ result, onAgain }: Props) {
  const host = result.host || result.url;
  const checks = checkCount(result.categories.length);

  return (
    <div className="score-card">
      <p className="score-host">
        {COPY.scoreFor} <strong>{host}</strong>
      </p>
      <p className="score-total">
        <span className="score-number">{result.score}</span> {COPY.outOf}
      </p>

      <ul className="score-bars">
        {result.categories.map((category) => (
          <li key={category.id}>
            <span className="score-bar-label">
              {category.label}
              <span className="score-bar-value">
                {category.score} / {category.max}
              </span>
            </span>
            <span className="score-bar" aria-hidden="true">
              <span style={{ width: `${(category.score / category.max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>

      <h3>{COPY.findingsTitle}</h3>
      {result.findings.length > 0 ? (
        <ul className="marklist marklist-bad">
          {result.findings.map((finding) => (
            <li key={finding.key}>{finding.text}</li>
          ))}
        </ul>
      ) : (
        <p>{COPY.noFindings(checks)}</p>
      )}
      <p className="score-caveat">{COPY.caveat(checks)}</p>

      <div className="score-offer">
        <h3>{COPY.offerTitle}</h3>
        <p>{COPY.offerText}</p>
        <a className="btn btn-primary" href={mailto(COPY.offerSubject(host))}>
          {COPY.offerButton}
        </a>
      </div>

      <p className="score-again">
        <button type="button" className="link-button" onClick={onAgain}>
          {COPY.again}
        </button>
      </p>
      <p className="score-legal">
        <Link href="/integritet">Integritetspolicy</Link>
        {" · "}
        <Link href="/villkor">Villkor</Link>
      </p>
    </div>
  );
}

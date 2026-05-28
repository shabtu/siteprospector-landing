import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = process.env.AUDIT_WEBHOOK_URL ?? "";
const WEBHOOK_SECRET = process.env.AUDIT_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.url || !body?.email) {
    return NextResponse.json({ error: "url and email required" }, { status: 400 });
  }

  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: "Audit service not configured" }, { status: 503 });
  }

  const res = await fetch(`${WEBHOOK_URL}/audit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Secret": WEBHOOK_SECRET,
    },
    body: JSON.stringify({ url: body.url, email: body.email, name: body.name ?? "" }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Audit service error" }, { status: 502 });
  }

  return NextResponse.json({ status: "queued" }, { status: 202 });
}

import { enquirySchema } from "@/lib/validation";
import { emailConfig, sendEnquiryEmail } from "@/lib/email";

/**
 * Best-effort, per-instance rate limit. On serverless hosts each instance keeps
 * its own memory, so this is NOT persistent protection — see README.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many enquiries from this connection. Please try again later or email us directly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Respond neutrally without sending.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return Response.json({ ok: false, error: "Unable to process this enquiry." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return Response.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  if (!emailConfig()) {
    console.error("[enquiry] RESEND_API_KEY / CONTACT_FROM_EMAIL not configured");
    return Response.json(
      { ok: false, error: "Online enquiries are temporarily unavailable. Please email mahi@novacovenanttrading.com directly." },
      { status: 503 },
    );
  }

  try {
    await sendEnquiryEmail(parsed.data);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[enquiry] send failed", err);
    return Response.json(
      { ok: false, error: "We couldn't send your enquiry just now. Please try again or email mahi@novacovenanttrading.com." },
      { status: 502 },
    );
  }
}

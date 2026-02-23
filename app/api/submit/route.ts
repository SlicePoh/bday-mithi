import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type IncomingGift = {
  id?: number;
  title?: string;
  link?: string | null;
};

async function sendMail(opts: { subject: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO;

  console.log("[mail] env check:", {
    apiKey: apiKey ? `${apiKey.slice(0, 6)}…` : "MISSING",
    to: to ?? "MISSING",
  });

  if (!apiKey || !to) {
    throw new Error("Missing required mail env vars (RESEND_API_KEY, EMAIL_TO)");
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: `${process.env.EMAIL_FROM_LABEL} <onboarding@resend.dev>`,
    to,
    subject: opts.subject,
    text: opts.text,
  });

  if (error) {
    console.error("[mail] resend error:", error);
    throw new Error(`Resend error: ${error.message}`);
  }

  console.log("[mail] sent, id:", data?.id);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      gifts?: unknown;
      wishes?: unknown;
    };
    console.log("[submit] body received:", JSON.stringify(body).slice(0, 200));

    const gifts = Array.isArray(body.gifts) ? (body.gifts as IncomingGift[]) : [];
    const wishes = typeof body.wishes === "string" ? body.wishes : "";

    const picked = gifts.map((g) => ({
      id: typeof g.id === "number" ? g.id : undefined,
      title: typeof g.title === "string" ? g.title : "(untitled)",
      link: typeof g.link === "string" ? g.link : null,
    }));

    if (picked.length === 0) {
      return new NextResponse("No gifts to submit.", { status: 400 });
    }

    const lines = picked
      .map((g, idx) => `${idx + 1}. ${g.title}\n   ${g.link ?? "No link"}`)
      .join("\n\n");

    const text = [
      "Birthday Wishlist Submission",
      "",
      lines,
      wishes ? "\n\nExtra wishes:\n" + wishes : "",
    ].join("\n");

    await sendMail({ subject: "Birthday wishlist 🎁", text });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit] caught error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}



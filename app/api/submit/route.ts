import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type IncomingGift = {
  id?: number;
  title?: string;
  link?: string | null;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      gifts?: unknown;
      wishes?: unknown;
    };

    const gifts = Array.isArray(body.gifts) ? (body.gifts as IncomingGift[]) : [];
    const wishes = typeof body.wishes === "string" ? body.wishes : "";

    const picked = gifts
      .map((g) => ({
        id: typeof g.id === "number" ? g.id : undefined,
        title: typeof g.title === "string" ? g.title : "(untitled)",
        link: typeof g.link === "string" ? g.link : null,
      }))
      .filter((g) => !!g.link);

    if (picked.length === 0) {
      return new NextResponse("No gifts with links to submit.", { status: 400 });
    }

    const host = requiredEnv("SMTP_HOST");
    const port = Number(requiredEnv("SMTP_PORT"));
    const secure = (process.env.SMTP_SECURE ?? "").toLowerCase() === "true";
    const user = requiredEnv("SMTP_USER");
    const pass = requiredEnv("SMTP_PASS");
    const from = requiredEnv("EMAIL_FROM");
    const to = requiredEnv("EMAIL_TO");

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const lines = picked
      .map((g, idx) => `${idx + 1}. ${g.title}\n   ${g.link}`)
      .join("\n\n");

    const text = [
      "Wishlist confirmation",
      "",
      lines,
      wishes ? "\n\nExtra wishes:\n" + wishes : "",
    ].join("\n");

    await transporter.sendMail({
      from,
      to,
      subject: "Birthday wishlist confirmation",
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}

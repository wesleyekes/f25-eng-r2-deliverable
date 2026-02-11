/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string };

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const response = await generateResponse(body.message);

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}

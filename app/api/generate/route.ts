import { NextResponse } from "next/server";
import { generateSlides } from "@/lib/ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const slides = await generateSlides(prompt);

  return NextResponse.json({ slides });
}
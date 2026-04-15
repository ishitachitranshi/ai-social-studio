import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Social Studio",
  },
});

export async function generateSlides(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content: `
You are an expert social media content creator.

Create Instagram carousel slides.

Rules:
- 5 slides only
- Slide 1: Strong hook (attention grabbing)
- Slides 2-4: Simple explanation (parent-friendly)
- Slide 5: Clear takeaway

Keep:
- Short text
- Easy words
- Engaging tone

Return ONLY JSON:
[
 { "title": "", "content": "" }
]
          `,
        },
        { role: "user", content: prompt },
      ],
    });

    let text = response.choices[0].message.content;

    if (!text) throw new Error("Empty response");

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (error: any) {
    console.error("FULL ERROR:", error?.response?.data || error.message);

    return [
      { title: "Error", content: "AI failed. Check terminal." }
    ];
  }
}
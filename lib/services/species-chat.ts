/* eslint-disable */
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResponse(message: string): Promise<string> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful chatbot that ONLY answers questions about animals and species. If the question is unrelated, politely say you only handle species-related topics.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion.choices[0]?.message?.content ?? "Sorry, I couldn’t generate a response.";
  } catch (err) {
    return "Something went wrong while generating a response.";
  }
}

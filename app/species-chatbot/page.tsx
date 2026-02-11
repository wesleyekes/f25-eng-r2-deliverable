"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function SpeciesChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = (await res.json()) as { response?: string };

      const botMessage: Message = {
        role: "bot",
        content: data.response ?? "No response from chatbot.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Species Chatbot</h1>

      <div className="mb-4 h-[400px] overflow-y-auto rounded border p-4">
        {messages.length === 0 && <p className="text-muted-foreground">Ask a question about animals or species!</p>}

        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className="inline-block rounded bg-muted px-3 py-2">{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a species..."
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleSubmit(); // 👈 important
            }
          }}
        />

        <Button
          onClick={() => void handleSubmit()} // 👈 important
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
}

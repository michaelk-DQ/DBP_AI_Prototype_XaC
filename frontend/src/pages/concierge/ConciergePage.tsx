import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ChatMessage } from "../../components/concierge/ChatMessage";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  getConciergeWelcome,
  sendConciergeMessage,
  type ConciergeMessage,
} from "../../services/ai/conciergeService";
import { getAuthRecommendationContext } from "../../store/authStore";

export function ConciergePage() {
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [retrievedCount, setRetrievedCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = getAuthRecommendationContext();
    setMessages([getConciergeWelcome(context)]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const context = getAuthRecommendationContext();
    const userMsg: ConciergeMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendConciergeMessage(text, context);
      setRetrievedCount(response.retrievedCount);
      setMessages((prev) => [...prev, response.message]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <PageHeader
        title="Concierge AI"
        description="Ask about services, events, courses, and personalized guidance. Responses simulate retrieval-augmented AI."
        action={
          retrievedCount > 0 ? (
            <Badge className="bg-violet-100 text-violet-800">
              {retrievedCount} items retrieved
            </Badge>
          ) : null
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-muted/30">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {loading && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Concierge is thinking…
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="flex gap-2 border-t border-border bg-background p-4"
        >
          <Input
            placeholder="Ask about services, funding, events, or courses…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send size={16} />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

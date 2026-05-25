import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";
import { Send } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ChatMessage } from "../../components/concierge/ChatMessage";
import { FAQSuggestions } from "../../components/concierge/FAQSuggestions";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  getConciergeWelcome,
  initConciergeSession,
  sendConciergeMessage,
  type ConciergeMessage,
} from "../../services/ai/conciergeService";
import {
  getAuthRecommendationContext,
  useIsAuthenticated,
  useProfileId,
} from "../../store/authStore";

export function ConciergePage() {
  const isAuthenticated = useIsAuthenticated();
  const profileId = useProfileId();

  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [retrievedCount, setRetrievedCount] = useState(0);
  const [hasUserMessage, setHasUserMessage] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Re-bootstrap whenever auth state or active profile changes
  useEffect(() => {
    const context = getAuthRecommendationContext();
    initConciergeSession(context.isAuthenticated);
    setMessages([getConciergeWelcome(context)]);
    setHasUserMessage(false);
    setRetrievedCount(0);
    setInput("");
  }, [isAuthenticated, profileId]);

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
    setHasUserMessage(true);
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

  const handleSuggestionSelect = useCallback(async (question: string) => {
    if (loading) return;

    const context = getAuthRecommendationContext();
    const userMsg: ConciergeMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setHasUserMessage(true);
    setInput("");
    setLoading(true);

    try {
      const response = await sendConciergeMessage(question, context);
      setRetrievedCount(response.retrievedCount);
      setMessages((prev) => [...prev, response.message]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

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
          className="flex flex-col gap-0 border-t border-border bg-background"
        >
          {!hasUserMessage && (
            <FAQSuggestions onSelect={handleSuggestionSelect} count={4} />
          )}
          <div className="flex gap-2 p-4">
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
          </div>
        </form>
      </div>
    </div>
  );
}

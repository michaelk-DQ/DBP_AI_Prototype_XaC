import { useMemo } from "react";
import { Sparkles } from "lucide-react";

const ALL_SUGGESTIONS = [
  "What services does Khalifa Fund provide?",
  "How do I apply for funding?",
  "What training programs exist?",
  "What financing support is available?",
  "How does invoice financing work?",
  "What is the Enterprise Journey Platform?",
  "How do I register on eJP?",
  "Who is eligible to use eJP?",
  "How do I track my application status?",
  "Can I apply for multiple services at once?",
  "What browser does eJP support?",
  "How do I reset my password?",
  "What is the difference between enterprise and service provider accounts?",
  "How do I manage my team members?",
];

interface FAQSuggestionsProps {
  onSelect: (question: string) => void;
  count?: number;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function FAQSuggestions({ onSelect, count = 4 }: FAQSuggestionsProps) {
  // Stable random selection per mount — changes on page refresh
  const suggestions = useMemo(() => pickRandom(ALL_SUGGESTIONS, count), [count]);

  return (
    <div className="px-4 pb-3 pt-1 sm:px-6">
      <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles size={12} className="text-violet-400" />
        <span>Suggested questions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950 dark:hover:text-violet-300 active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

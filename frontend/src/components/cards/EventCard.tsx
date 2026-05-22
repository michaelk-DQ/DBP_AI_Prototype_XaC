import { Bookmark, MapPin } from "lucide-react";
import type { EventRecord } from "../../types/knowledge";
import { useSavedItemsStore } from "../../store/savedItemsStore";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface EventCardProps {
  event: EventRecord;
  whyRecommended?: string;
}

export function EventCard({ event, whyRecommended }: EventCardProps) {
  const toggle = useSavedItemsStore((s) => s.toggleItem);
  const saved = useSavedItemsStore((s) => s.isSaved("event", event.slug));

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{event.event_title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label={saved ? "Remove from saved" : "Save event"}
            onClick={() =>
              toggle({
                domain: "event",
                slug: event.slug,
                title: event.event_title,
                description: event.event_description,
                tags: event.tags ?? [],
              })
            }
          >
            <Bookmark className={saved ? "fill-primary" : ""} size={16} />
          </Button>
        </div>
        <CardDescription>{event.event_type} · {event.delivery_mode}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {event.event_description}
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin size={12} />
          {event.event_location}
        </p>
        {whyRecommended && (
          <p className="rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
            <span className="font-medium">Why recommended: </span>
            {whyRecommended}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {(event.tags ?? []).slice(0, 4).map((tag) => (
            <Badge key={tag} className="bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

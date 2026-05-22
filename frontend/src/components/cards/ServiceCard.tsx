import { Bookmark } from "lucide-react";
import type { ServiceRecord } from "../../types/knowledge";
import { useSavedItemsStore } from "../../store/savedItemsStore";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface ServiceCardProps {
  service: ServiceRecord;
  whyRecommended?: string;
}

export function ServiceCard({ service, whyRecommended }: ServiceCardProps) {
  const toggle = useSavedItemsStore((s) => s.toggleItem);
  const saved = useSavedItemsStore((s) => s.isSaved("service", service.slug));

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{service.service_name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label={saved ? "Remove from saved" : "Save service"}
            onClick={() =>
              toggle({
                domain: "service",
                slug: service.slug,
                title: service.service_name,
                description: service.service_description,
                tags: service.tags ?? [],
              })
            }
          >
            <Bookmark className={saved ? "fill-primary" : ""} size={16} />
          </Button>
        </div>
        <CardDescription>{service.service_category}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {service.service_description}
        </p>
        {whyRecommended && (
          <p className="rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
            <span className="font-medium">Why recommended: </span>
            {whyRecommended}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {(service.tags ?? []).slice(0, 4).map((tag) => (
            <Badge key={tag} className="bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

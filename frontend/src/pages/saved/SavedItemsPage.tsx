import { Trash2 } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  useSavedItemsByDomain,
  useSavedItemsStore,
} from "../../store/savedItemsStore";

function SavedList({ domain }: { domain: "service" | "course" | "event" }) {
  const items = useSavedItemsByDomain(domain);
  const remove = useSavedItemsStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No saved {domain}s yet. Bookmark items from Discover or Browse.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={`${item.domain}-${item.slug}`}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground capitalize">
                {item.domain}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove"
              onClick={() => remove(item.domain, item.slug)}
            >
              <Trash2 size={16} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {(item.tags ?? []).slice(0, 4).map((tag) => (
                <Badge key={tag} className="bg-muted">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SavedItemsPage() {
  const total = useSavedItemsStore((s) => s.items.length);

  return (
    <div>
      <PageHeader
        title="Saved Items"
        description={`${total} items saved locally for this prototype session.`}
      />
      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="services">
          <SavedList domain="service" />
        </TabsContent>
        <TabsContent value="events">
          <SavedList domain="event" />
        </TabsContent>
        <TabsContent value="courses">
          <SavedList domain="course" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ServiceCard } from "../../components/cards/ServiceCard";
import { Input } from "../../components/ui/input";
import {
  getBusinessStages,
  getServiceCategories,
  searchServices,
} from "../../services/ai/retrievalService";
import { selectBusinessStage, useAuthStore } from "../../store/authStore";

export function DiscoverServicesPage() {
  const businessStage = useAuthStore(selectBusinessStage);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [stage, setStage] = useState(
    businessStage === "Exploration" ? "" : businessStage
  );

  const categories = useMemo(() => getServiceCategories(), []);
  const stages = useMemo(() => getBusinessStages(), []);

  const results = useMemo(
    () =>
      searchServices({
        query,
        category: category || undefined,
        businessStage: stage || undefined,
      }),
    [query, category, stage]
  );

  return (
    <div>
      <PageHeader
        title="Discover Services"
        description="Search and filter the UAE SME services catalog with prototype retrieval."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            className="pl-9"
            placeholder="Search services…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="">All stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {results.length} service{results.length !== 1 ? "s" : ""} found
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
            No services match your filters.
          </p>
        ) : (
          results.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))
        )}
      </div>
    </div>
  );
}

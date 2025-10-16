"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchIndex } from "@shared/lib/content";
import type { ContentIndex } from "@shared/types/content";

export default function GlossaryPage() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchIndex().then(setIndex).catch(() => setIndex(null));
  }, []);

  const allTags = useMemo(() => {
    if (!index) return [];
    const tags = new Set<string>();
    index.glossary.forEach((term) => {
      term.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [index]);

  const filteredTerms = useMemo(() => {
    if (!index) return [];
    let terms = index.glossary;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query)
      );
    }

    if (selectedTag) {
      terms = terms.filter((term) => term.tags?.includes(selectedTag));
    }

    return terms;
  }, [index, searchQuery, selectedTag]);

  if (!index) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-muted-foreground">Загрузка глоссария...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Глоссарий кибербезопасности</h1>
        <p className="text-muted-foreground">
          Справочник основных терминов и понятий
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Поиск терминов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 text-lg border-2 rounded-lg focus:border-primary focus:outline-none"
        />

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedTag === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Все
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Найдено терминов: {filteredTerms.length}
      </div>

      {/* Terms List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="p-5 rounded-lg border-2 bg-card hover:border-primary/50 transition-colors"
          >
            <h3 className="text-xl font-bold mb-2">{term.term}</h3>
            <p className="text-muted-foreground mb-3">{term.definition}</p>
            {term.tags && term.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {term.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-3">🔍</div>
          <p>Термины не найдены. Попробуйте изменить запрос.</p>
        </div>
      )}
    </main>
  );
}


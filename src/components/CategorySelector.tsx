"use client";

import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  "Küste",
  "Wattenmeer",
  "Wald",
  "See/Teich",
  "Stadtansicht",
  "Leuchtturm",
  "Sonnenuntergang",
  "Sonstiges",
] as const;

interface CategorySelectorProps {
  selected: string[];
  onChange: (categories: string[]) => void;
}

export function CategorySelector({
  selected,
  onChange,
}: CategorySelectorProps) {
  const toggleCategory = (cat: string) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isSelected = selected.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => toggleCategory(cat)}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer select-none px-3 py-1.5 text-sm transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}

export { CATEGORIES };

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
    <div className="flex flex-wrap gap-2.5">
      {CATEGORIES.map((cat) => {
        const isSelected = selected.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => toggleCategory(cat)}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer select-none rounded-lg px-4 py-2 text-sm transition-all duration-300 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                  : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
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

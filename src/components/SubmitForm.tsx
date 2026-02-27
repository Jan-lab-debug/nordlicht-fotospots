"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelector } from "@/components/CategorySelector";
import { PhotoUploader, type UploadedPhoto } from "@/components/PhotoUploader";
import {
  Loader2,
  CheckCircle2,
  MapPin,
  Camera,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const REGIONS = [
  "Schleswig-Holstein",
  "Hamburg",
  "Bremen",
  "Niedersachsen",
  "Mecklenburg-Vorpommern",
] as const;

const BEST_TIMES = [
  { value: "morning", label: "Morgens / Goldene Stunde" },
  { value: "midday", label: "Mittags" },
  { value: "evening", label: "Abends / Blaue Stunde" },
  { value: "night", label: "Nacht" },
];

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name ist erforderlich")
    .max(200, "Name darf max. 200 Zeichen lang sein"),
  region: z.enum(REGIONS, { message: "Bitte eine Region auswählen" }),
  latitude: z
    .string()
    .min(1, "Breitengrad ist erforderlich")
    .refine(
      (v) => {
        const n = parseFloat(v);
        return !isNaN(n) && n >= -90 && n <= 90;
      },
      { message: "Breitengrad muss zwischen -90 und 90 liegen (z.B. 53.5511)" }
    ),
  longitude: z
    .string()
    .min(1, "Längengrad ist erforderlich")
    .refine(
      (v) => {
        const n = parseFloat(v);
        return !isNaN(n) && n >= -180 && n <= 180;
      },
      {
        message:
          "Längengrad muss zwischen -180 und 180 liegen (z.B. 9.9937)",
      }
    ),
  description: z
    .string()
    .min(1, "Beschreibung ist erforderlich")
    .max(2000, "Beschreibung darf max. 2000 Zeichen lang sein"),
  best_time: z.string().optional(),
  equipment: z
    .string()
    .max(500, "Max. 500 Zeichen")
    .optional(),
  photo_tips: z
    .string()
    .max(1000, "Max. 1000 Zeichen")
    .optional(),
  // Honeypot
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SubmitForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [spotFolder] = useState(() => crypto.randomUUID());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      region: undefined,
      latitude: "",
      longitude: "",
      description: "",
      best_time: "",
      equipment: "",
      photo_tips: "",
      website: "",
    },
  });

  const handlePhotosChange = useCallback((newPhotos: UploadedPhoto[]) => {
    setPhotos(newPhotos);
  }, []);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        name: values.name,
        region: values.region,
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
        description: values.description,
        best_time: values.best_time || null,
        equipment: values.equipment || null,
        photo_tips: values.photo_tips || null,
        categories,
        photos: photos.map((p) => p.url),
        cover_photo: photos.length > 0 ? photos[0].url : null,
        website: values.website || "",
      };

      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Einreichung fehlgeschlagen");
      }

      setIsSuccess(true);
      form.reset();
      setCategories([]);
      setPhotos([]);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Ein unerwarteter Fehler ist aufgetreten."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="animate-scale-in mx-auto max-w-lg rounded-2xl border border-primary/20 bg-card/60 p-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-bold">
          Spot erfolgreich eingereicht!
        </h2>
        <p className="mb-8 text-muted-foreground leading-relaxed">
          Vielen Dank! Dein Fotospot ist jetzt für alle sichtbar.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild className="gap-2 font-display font-semibold bg-primary hover:bg-primary/90">
            <Link href="/">
              Zur Übersicht
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-border/60 hover:border-primary/40"
            onClick={() => {
              setIsSuccess(false);
              setSubmitError(null);
            }}
          >
            Weiteren Spot einreichen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Section 1: Basic Info */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Grundinformationen</h2>
              <p className="text-sm text-muted-foreground">Wo befindet sich der Spot?</p>
            </div>
          </div>

          <div className="space-y-5 rounded-xl border border-border/30 bg-card/30 p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Name des Spots *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Westerhever Leuchtturm"
                      className="border-border/40 bg-background/50 focus:border-primary/50 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Region *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-border/40 bg-background/50 focus:border-primary/50">
                        <SelectValue placeholder="Region auswählen..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Breitengrad *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="z.B. 54.3741"
                        className="border-border/40 bg-background/50 font-mono text-sm focus:border-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Dezimalformat</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Längengrad *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="z.B. 8.6084"
                        className="border-border/40 bg-background/50 font-mono text-sm focus:border-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Dezimalformat</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Beschreibung *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beschreibe den Spot: Was macht ihn besonders? Wie kommt man hin? Was gibt es zu beachten?"
                      className="min-h-[140px] resize-y border-border/40 bg-background/50 focus:border-primary/50 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {field.value?.length || 0} / 2000 Zeichen
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Section 2: Photo Tips */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">
                Foto-Tipps
                <span className="ml-2 text-sm font-normal text-muted-foreground">(optional)</span>
              </h2>
              <p className="text-sm text-muted-foreground">Hilf anderen Fotografen den Spot optimal zu nutzen</p>
            </div>
          </div>

          <div className="space-y-5 rounded-xl border border-border/30 bg-card/30 p-6">
            <FormField
              control={form.control}
              name="best_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Beste Tageszeit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-border/40 bg-background/50 focus:border-primary/50">
                        <SelectValue placeholder="Tageszeit auswählen..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BEST_TIMES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Empfohlene Ausrüstung</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Weitwinkel, Stativ, ND-Filter"
                      className="border-border/40 bg-background/50 focus:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo_tips"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Foto-Tipps & Winkel</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. Bester Winkel von Süden, Vordergrund mit Strandhafer nutzen..."
                      className="min-h-[100px] resize-y border-border/40 bg-background/50 focus:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Section 3: Categories */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">
                Kategorien
                <span className="ml-2 text-sm font-normal text-muted-foreground">(optional)</span>
              </h2>
              <p className="text-sm text-muted-foreground">Wähle passende Kategorien für deinen Spot</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/30 bg-card/30 p-6">
            <CategorySelector
              selected={categories}
              onChange={setCategories}
            />
          </div>
        </section>

        {/* Section 4: Photos */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Camera className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">
                Fotos hochladen
                <span className="ml-2 text-sm font-normal text-muted-foreground">(optional)</span>
              </h2>
              <p className="text-sm text-muted-foreground">Zeige anderen wie es dort aussieht</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/30 bg-card/30 p-6">
            <PhotoUploader
              photos={photos}
              onPhotosChange={handlePhotosChange}
              spotFolder={spotFolder}
            />
          </div>
        </section>

        {/* Honeypot - invisible to humans */}
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input tabIndex={-1} autoComplete="off" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {submitError}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full gap-2.5 font-display text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 h-13"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Wird eingereicht...
            </>
          ) : (
            <>
              Spot einreichen
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

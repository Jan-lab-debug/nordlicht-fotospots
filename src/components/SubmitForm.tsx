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
import { Loader2, CheckCircle2, MapPin, Camera, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <Card className="mx-auto max-w-lg border-primary/20 bg-card/50">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">
            Spot erfolgreich eingereicht!
          </h2>
          <p className="mb-6 text-muted-foreground">
            Vielen Dank! Dein Fotospot ist jetzt für alle sichtbar.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/">Zur Übersicht</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccess(false);
                setSubmitError(null);
              }}
            >
              Weiteren Spot einreichen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Info */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Grundinformationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name des Spots *</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Westerhever Leuchtturm" {...field} />
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
                  <FormLabel>Region *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                    <FormLabel>Breitengrad *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="z.B. 54.3741"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Dezimalformat, z.B. 54.3741</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Längengrad *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="z.B. 8.6084"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Dezimalformat, z.B. 8.6084</FormDescription>
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
                  <FormLabel>Beschreibung *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beschreibe den Spot: Was macht ihn besonders? Wie kommt man hin? Was gibt es zu beachten?"
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0} / 2000 Zeichen
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section 2: Photo Tips */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-accent" />
              Foto-Tipps
              <span className="text-sm font-normal text-muted-foreground">
                (optional)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="best_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beste Tageszeit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                  <FormLabel>Empfohlene Ausrüstung</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Weitwinkel, Stativ, ND-Filter"
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
                  <FormLabel>Foto-Tipps & Winkel</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. Bester Winkel von Süden, Vordergrund mit Strandhafer nutzen..."
                      className="min-h-[80px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section 3: Categories */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">
              Kategorien
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                (optional)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategorySelector
              selected={categories}
              onChange={setCategories}
            />
          </CardContent>
        </Card>

        {/* Section 4: Photos */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Camera className="h-5 w-5 text-primary" />
              Fotos hochladen
              <span className="text-sm font-normal text-muted-foreground">
                (optional)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoUploader
              photos={photos}
              onPhotosChange={handlePhotosChange}
              spotFolder={spotFolder}
            />
          </CardContent>
        </Card>

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

        <Separator />

        {/* Submit error */}
        {submitError && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {submitError}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Wird eingereicht...
            </>
          ) : (
            "Spot einreichen"
          )}
        </Button>
      </form>
    </Form>
  );
}

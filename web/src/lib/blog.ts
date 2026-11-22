import type { Post } from "./sanity";

export const postCategories = [
  { value: "wissen", label: "Wissen" },
  { value: "rezepte", label: "Rezepte" },
  { value: "tipps", label: "Tipps" },
] as const;

export const categoryLabel = (value?: string | null) => postCategories.find((c) => c.value === value)?.label ?? "Wissen";

const dateFormat = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "long", year: "numeric" });
export const formatPostDate = (date: string) => dateFormat.format(new Date(date));

/** Lesezeit in Minuten (ca. 200 Wörter pro Minute), aus reinem Text oder Editor-Blöcken */
export function readingMinutes(body: Post["body"]): number {
  const text =
    typeof body === "string"
      ? body
      : (body ?? [])
          .flatMap((block) => ("children" in block && Array.isArray(block.children) ? block.children : []))
          .map((child) => ("text" in child ? String(child.text) : ""))
          .join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

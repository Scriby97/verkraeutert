import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { imageUrl, type Post, type SanityImage } from "@/lib/sanity";
import { RichText, richTextComponents } from "./RichText";

// Artikeltext: wie RichText, dazu Bilder zwischen den Absätzen (mit Bildunterschrift)
const components: PortableTextComponents = {
  ...richTextComponents,
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string | null } }) => {
      const src = imageUrl(value);
      if (!src) return null;
      return (
        <figure className="my-4 flex flex-col gap-2">
          <Image src={src} alt={value.alt ?? ""} width={1200} height={900} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full rounded-2xl" />
          {value.caption && <figcaption className="text-sm text-muted">{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};

const proseClass = "text-lg leading-relaxed text-ink/90";

export function PostBody({ value }: { value: Post["body"] }) {
  if (!value || typeof value === "string") return <RichText value={value} className={proseClass} />;
  return (
    <div className={`flex flex-col gap-4 ${proseClass}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}

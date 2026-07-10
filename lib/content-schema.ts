import { z } from "zod";

export const imageVariantSchema = z.object({
  small: z.string().min(1),
  medium: z.string().min(1),
  large: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const artworkSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  year: z.number().int().min(1900).max(2200),
  medium: z.string().min(1),
  dimensions: z.string().min(1),
  image: imageVariantSchema,
});

export const artworkCollectionSchema = z.object({
  year: z.number().int().min(1900).max(2200),
  works: z.array(artworkSchema),
});

export type Artwork = z.infer<typeof artworkSchema>;
export type ArtworkCollection = z.infer<typeof artworkCollectionSchema>;

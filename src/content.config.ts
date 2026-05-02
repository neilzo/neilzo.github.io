import { defineCollection, z } from 'astro:content';

const TAGS = [
  'Writing', 'Photos', 'Reviews', 'Food', 'Games',
  'Movies', 'TV', 'Anime', 'Drinks', 'Books',
  'Travel', 'Gear', 'Software', 'Tech Industry',
  'Thoughts'
] as const;

const sharedPostFields = {
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.enum(TAGS)),
  draft: z.boolean().default(false),
  excerpt: z.string().optional(),
  entryNumber: z.string().optional(),
  youtubeId: z.string().optional(),
};

const posts = defineCollection({
  type: 'content',
  schema: z.discriminatedUnion('template', [
    z.object({
      template: z.literal('text'),
      ...sharedPostFields,
    }),
    z.object({
      template: z.literal('photos'),
      images: z.array(z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
        plateLabel: z.string().optional(),
      })),
      camera: z.string().optional(),
      location: z.string().optional(),
      rating: z.number().min(0).max(5).optional(),
      ...sharedPostFields,
    }),
    z.object({
      template: z.literal('review'),
      rating: z.number().min(0).max(5),
      excerpt: z.string(), // required — this is the full review text
      category: z.enum(['Restaurant', 'Bar', 'Gear', 'Software', 'Movie', 'TV', 'Game', 'Book', 'Drink']),
      image: z.string().optional(),
      ...sharedPostFields,
    }),
  ]),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    tagline: z.string(),
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string().url(),
        description: z.string().optional(),
      })
    ).optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

const setup = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

const favorites = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

const currently = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = {
  posts,
  about,
  setup,
  favorites,
  currently,
};

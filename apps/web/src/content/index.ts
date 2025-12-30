import z from "zod";

import DigitalAds, { meta as DigitalAdsMeta } from './digital-ads.mdx';
import DigitalPresenceOfGovernments, { meta as DigitalPresenceOfGovernmentsMeta } from './digital-presence-of-governements.mdx';
import GPXFiles, { meta as GPXFilesMeta } from './gpx-files.mdx';
import LangageGuerreMondeProfessionnel, { meta as LangageGuerreMondeProfessionnelMeta } from './langage-guerre-monde-professionnel.mdx';
import SeekubeRewind, { meta as SeekubeRewindMeta } from './seekube-rewind.mdx';
import Soundslice, { meta as SoundsliceMeta } from './soundslice.mdx';
import TunerPt1, { meta as TunerPt1Meta } from './tuner-pt1.mdx';
import TunerPt2, { meta as TunerPt2Meta } from './tuner-pt2.mdx';
import TunerPt3, { meta as TunerPt3Meta } from './tuner-pt3.mdx';
import WhenToUseUseCallbackAndUseMemo, { meta as WhenToUseUseCallbackAndUseMemoMeta } from './when-to-use-useCallback-useMemo.mdx';
import Wildcard, { meta as WildcardMeta } from './wildcard.mdx';


export const ArticleMetaZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  slug: z.string(),
  published: z.boolean().optional()
});

const posts = [
  { meta: TunerPt1Meta, content: TunerPt1 },
  { meta: TunerPt2Meta, content: TunerPt2 },
  { meta: TunerPt3Meta, content: TunerPt3 },
  { meta: DigitalAdsMeta, content: DigitalAds },
  { meta: LangageGuerreMondeProfessionnelMeta, content: LangageGuerreMondeProfessionnel },
  { meta: DigitalPresenceOfGovernmentsMeta, content: DigitalPresenceOfGovernments },
  { meta: GPXFilesMeta, content: GPXFiles },
  { meta: SeekubeRewindMeta, content: SeekubeRewind },
  { meta: SoundsliceMeta, content: Soundslice },
  { meta: WhenToUseUseCallbackAndUseMemoMeta, content: WhenToUseUseCallbackAndUseMemo },
  { meta: WildcardMeta, content: Wildcard },
];

export const listAllPostMetas = () => {
  return posts
    .map((post) => ({
      meta: post.meta,
    }))
    .filter((post) => {
      try {
        const parsedMeta = ArticleMetaZodSchema.parse(post.meta);
        if (parsedMeta.published) {
          return true;
        } else {
          // silently ignore unpublished posts
          return false;
        }
      } catch (error) {
        console.error(error, post.meta);
        return false;
      }
    });
};

export const listAllPosts = () => {
  return posts.map((post) => ({
    meta: ArticleMetaZodSchema.parse(post.meta),
    content: post.content
  }));
};

export const findPostBySlug = (slug: string) => {
  const posts = listAllPosts();
  return posts.find((post) => post.meta.slug === slug);
};
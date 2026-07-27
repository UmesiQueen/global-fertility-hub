import type { Entity, FertilityTopic } from "@/types";

/**
 * Cross-entity relatedness.
 *
 * The brief asks for "related resources / related clinics / related webinars /
 * similar stories" on nearly every detail page. Hand-maintaining those links
 * across five entity types would mean ~20 relationship lists that silently rot
 * whenever content changes.
 *
 * Instead every entity carries `tags: FertilityTopic[]` and relatedness is
 * computed from tag overlap, in one place. When the CMS lands, editors curate
 * tags — not relationships — and this keeps working.
 */

/**
 * Weighted overlap between two tag sets.
 *
 * Rarer tags count for more: two records both tagged `endometriosis` are a
 * stronger signal than two both tagged `ivf`, which is on nearly everything.
 * Without that weighting every IVF record looks equally related to every other
 * one and the "related" rail becomes noise.
 */
function scoreOverlap(
  a: FertilityTopic[],
  b: FertilityTopic[],
  tagFrequency: Map<FertilityTopic, number>,
  corpusSize: number,
): number {
  let score = 0;

  for (const tag of a) {
    if (!b.includes(tag)) continue;
    const frequency = tagFrequency.get(tag) ?? 1;
    // Inverse document frequency, shifted to stay positive for tags that
    // appear on every record.
    score += Math.log(corpusSize / frequency) + 1;
  }

  return score;
}

function buildTagFrequency<T extends Entity>(
  pool: T[],
): Map<FertilityTopic, number> {
  const frequency = new Map<FertilityTopic, number>();

  for (const item of pool) {
    for (const tag of item.tags) {
      frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
    }
  }

  return frequency;
}

/**
 * Finds the items in `pool` most related to `source`.
 *
 * Works across entity types — a Story can pull related Clinics — because it
 * only depends on `tags` and `id`. Items sharing no tags are excluded rather
 * than padded in: an unrelated suggestion is worse than a shorter list,
 * especially on health content.
 */
export function findRelated<T extends Entity>(
  source: Pick<Entity, "id" | "tags">,
  pool: T[],
  limit = 3,
): T[] {
  const candidates = pool.filter((item) => item.id !== source.id);
  const tagFrequency = buildTagFrequency(candidates);
  const corpusSize = Math.max(candidates.length, 1);

  return candidates
    .map((item) => ({
      item,
      score: scoreOverlap(source.tags, item.tags, tagFrequency, corpusSize),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

/**
 * Related items with a guaranteed minimum count.
 *
 * Detail pages with a fixed three-column rail look broken with one card in
 * them. This tops up from the rest of the pool, so callers can choose between
 * "only genuinely related" (findRelated) and "fill the row" (this).
 */
export function findRelatedWithFallback<T extends Entity>(
  source: Pick<Entity, "id" | "tags">,
  pool: T[],
  limit = 3,
): T[] {
  const related = findRelated(source, pool, limit);
  if (related.length >= limit) return related;

  const chosen = new Set(related.map((item) => item.id));
  const filler = pool.filter(
    (item) => item.id !== source.id && !chosen.has(item.id),
  );

  return [...related, ...filler.slice(0, limit - related.length)];
}

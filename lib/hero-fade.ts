import type { CSSProperties } from "react";

/**
 * How much of each hero photo fades into the page background.
 *
 * Every value is a percentage of the photo's own size, and every hero with a
 * bleeding photo (PageHero, AboutHero) reads from here — change a number once
 * and every page follows.
 *
 * - left:   how far in from the photo's left edge the fade reaches before the
 *           photo is fully visible. Lower = more of the photo shows. If the
 *           hard vertical seam comes back, nudge this up.
 * - top:    same, down from the top edge. 0 turns the top fade off.
 * - bottom: same, up from the bottom edge. 0 turns the bottom fade off.
 */
export const HERO_FADE = {
  left: 30,
  top: 6,
  bottom: 8,
};

function mask(gradient: string): CSSProperties {
  return { maskImage: gradient, WebkitMaskImage: gradient };
}

/** Fades the left edge. Put it on the element whose box matches the photo. */
export function heroFadeLeft(left: number = HERO_FADE.left): CSSProperties {
  return mask(`linear-gradient(to right, transparent 0%, #000 ${left}%)`);
}

/** Fades the top and bottom edges. */
export function heroFadeTopBottom(
  top: number = HERO_FADE.top,
  bottom: number = HERO_FADE.bottom,
): CSSProperties {
  return mask(
    `linear-gradient(to bottom, transparent 0%, #000 ${top}%, #000 ${100 - bottom}%, transparent 100%)`,
  );
}

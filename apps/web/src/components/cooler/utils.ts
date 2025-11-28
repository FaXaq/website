import type { ColorsType, ColorType } from "./const";
import { COLORS, getCombinations } from "./const";

// Calculate relative luminance (WCAG formula)
function getLuminance(rgb: number[]): number {
  const r = rgb[0]!, g = rgb[1]!, b = rgb[2]!;

  const [rs, gs, bs] = [r, g, b].map(c => {
    return c / 255 <= 0.03928 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs! + 0.7152 * gs! + 0.0722 * bs!;
}

// Get contrasting text color (returns hex)
export function getContrastingColor(backgroundColor: number[]): string {
  // Calculate luminance
  const luminance = getLuminance(backgroundColor);

  // Return white for dark backgrounds, black for light backgrounds
  // Threshold of 0.5 works well, but you can adjust (0.179 is WCAG standard)
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Optional: Get a derived color with guaranteed contrast
export function getDerivedColor(backgroundColor: number[]): string {
  const luminance = getLuminance(backgroundColor);
  const r = backgroundColor[0]!, g = backgroundColor[1]!, b = backgroundColor[2]!;

  // Auto-determine if not specified
  const isDark = luminance > 0.5;

  if (isDark) {
    // Make darker version (multiply by 0.3)
    return `rgb(${Math.floor(r * 0.3)}, ${Math.floor(g * 0.3)}, ${Math.floor(b * 0.3)})`;
  } else {
    // Make lighter version (blend with white)
    return `rgb(${Math.floor(r + (255 - r) * 0.7)}, ${Math.floor(g + (255 - g) * 0.7)}, ${Math.floor(b + (255 - b) * 0.7)})`;
  }
}

const findHex = (colors: ColorsType, hex: string) => {
  return colors.colors.find(c => c.hex === hex);
};

const findSlug = (colors: ColorsType, slug: string) => {
  return colors.colors.find(c => c.slug === slug);
};

const findIndex = (colors: ColorsType, indexStr: string) => {
  const index = parseInt(indexStr);
  return colors.colors.find(c => c.index === index);
};

const findRGB = (colors: ColorsType, r: string, g: string, b: string) => {
  return colors.colors.find(c => c.rgb === `R:${r} / G:${g} / B:${b}`);
};

export const getColor = (color: string) => {
  const patterns = {
    hexNoHash: /^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
    rgb: /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/,
    index: /^\d+$/,
    slug: /^[a-z|'-][a-z0-9|'-]*(-[a-z0-9|'-]+)*$/i
  };

  let found: ColorType | undefined;
  const decodedColor = decodeURI(color);

  // Test hex without hash
  const match = decodedColor.match(patterns.hexNoHash);
  if (match && match[0]) {
    found = findHex(COLORS, `#${match[0]}`);
    if (found) {
      return {
        color: found,
        combinations: getCombinations(found)
      };
    }
    throw new Error("Color not found");
  }

  // Test RGB
  const matchRGB = decodedColor.match(patterns.rgb);
  if (matchRGB && matchRGB[1] && matchRGB[2] && matchRGB[3]) {
    found = findRGB(COLORS, matchRGB[1], matchRGB[2], matchRGB[3]);
    if (found) {
      return {
        color: found,
        combinations: getCombinations(found)
      };
    }
    throw new Error("Color not found");
  }

  // Test index
  const matchIndex = decodedColor.match(patterns.index);
  if (matchIndex && matchIndex[1]) {
    found = findIndex(COLORS, matchIndex[1]);
    if (found) {
      return {
        color: found,
        combinations: getCombinations(found)
      };
    }
    throw new Error("Color not found");
  }

  // Test slug
  const matchSlug = decodedColor.match(patterns.slug);
  if (matchSlug && matchSlug[0]) {
    found = findSlug(COLORS, matchSlug[0]);
    if (found) {
      return {
        color: found,
        combinations: getCombinations(found)
      };
    }
    throw new Error("Color not found");
  }
};

export const getColors = () => {
  return COLORS;
};

export const getColorCombination = (color: string, combination: number) => {
  try {
    const colorCombinations = getColor(color);
    const foundCombination = colorCombinations?.combinations.find(cc => cc.number === combination);
    if (!foundCombination) {
      throw new Error("Color combination not found");
    }

    return foundCombination;
  } catch (e) {
    throw new Error("Color combination not found");
  }
};
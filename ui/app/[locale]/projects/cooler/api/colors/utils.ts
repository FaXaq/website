
import type { ColorsType, ColorType } from "../../types";
import { COLORS, getCombinations } from "./const";

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

  let found: ColorType = undefined;
  const decodedColor = decodeURI(color);

  // Test hex without hash
  const match = decodedColor.match(patterns.hexNoHash);
  if (match) {
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
  if (matchRGB) {
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
  if (matchIndex) {
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
  if (matchSlug) {
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
    const foundCombination = colorCombinations.combinations.find(cc => cc.number === combination);
    if (!foundCombination) {
      throw new Error("Color combination not found");
    }

    return foundCombination;
  } catch (e) {
    throw new Error("Color combination not found");
  }
};
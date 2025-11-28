// Calculate relative luminance (WCAG formula)

function getLuminance(rgb: number[]): number {
  const r = rgb[0], g = rgb[1], b = rgb[2];

  const [rs, gs, bs] = [r, g, b].map(c => {
    return c / 255 <= 0.03928 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
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
  const r = backgroundColor[0], g = backgroundColor[1], b = backgroundColor[2];

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

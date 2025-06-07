export const mapColors: Record<string, string> = {
  // Active competitive pool
  'Haven': '#1e3a8a',     // Deep blue
  'Bind': '#854d0e',      // Amber/sandy
  'Ascent': '#166534',    // Italian green
  'Split': '#4c1d95',     // Purple/neon
  'Icebox': '#0891b2',    // Ice blue
  'Breeze': '#0d9488',    // Teal/aqua
  'Fracture': '#b45309',  // Orange/rust
  'Pearl': '#0e7490',     // Ocean blue
  'Lotus': '#be185d',     // Magenta
  'Sunset': '#ea580c',    // Sunset orange

  // Other or older maps
  'District': '#5b21b6',  // Violet
  'Kasbah': '#c2410c',    // Terra cotta
  'Drift': '#4338ca',     // Indigo

  // Case insensitive versions
  'haven': '#1e3a8a',
  'bind': '#854d0e',
  'ascent': '#166534',
  'split': '#4c1d95',
  'icebox': '#0891b2',
  'breeze': '#0d9488',
  'fracture': '#b45309',
  'pearl': '#0e7490',
  'lotus': '#be185d',
  'sunset': '#ea580c',

  // Default color
  'default': '#27272a',
};

/**
 * Get a map color with fallbacks for case-insensitive matching
 */
export const getMapColor = (mapName: string): string => {
  return mapColors[mapName] || mapColors[mapName.toLowerCase()] || mapColors.default;
};

/**
 * Create a lighter version of a color for accents and text
 */
export const getLighterColor = (hexColor: string): string => {
  try {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Make it lighter (increase RGB values)
    const lighterR = Math.min(255, Math.floor(r * 1.5));
    const lighterG = Math.min(255, Math.floor(g * 1.5));
    const lighterB = Math.min(255, Math.floor(b * 1.5));
    
    // Convert back to hex
    return `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;
  } catch {
    return '#60a5fa'; // Default light blue if conversion fails
  }
};

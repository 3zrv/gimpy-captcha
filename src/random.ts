function hslToRgb(hsl: string) {
  // Parse the HSL values from the input string
  const [hue, saturation, lightness] = hsl
    .replace(/hsla?|\(|\)/g, "")
    .split(",")
    .map((v: string) => parseFloat(v));

  // Convert the hue to a value between 0 and 360 (in degrees)
  const h = ((hue % 360) + 360) % 360;

  // Convert the saturation and lightness to values between 0 and 1
  const s = saturation / 100;
  const l = lightness / 100;

  // Calculate the chroma (color intensity) and secondary components
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  // Calculate the RGB values based on the hue and chroma
  let r, g, b;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  // Add the secondary components and convert the values to 8-bit integers
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  // Return the RGB values as an array of integers
  return [r, g, b];
}

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} A random integer between `min` and `max`.
 */
export function randomInt(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

/**
 * Alias for `randomInt`.
 */
export const int = randomInt;

/**
 * Generates a random shade of gray in hexadecimal format (#RRGGBB) based on the input range.
 *
 * @param {number} [min=1] The minimum gray value (between 1 and 9).
 * @param {number} [max=9] The maximum gray value (between 1 and 9).
 * @returns {string} A random gray color value in hexadecimal format (#RRGGBB).
 */
export function greyColor(min = 1, max = 9): string {
  const intensity = Math.floor((randomInt(min, max) * 255) / 15)
    .toString(16)
    .padStart(2, "0");
  return `#${intensity}${intensity}${intensity}`;
}

/**
 * Generates a random color value in hexadecimal format (#RRGGBB) based on the input background color.
 *
 * @param {string} [bgColor] The background color to base the generated color on. Must be a valid 6-digit hexadecimal color code.
 * @returns {string} A random color value in hexadecimal format (#RRGGBB).
 * @throws {Error} If the input background color is not a valid 6-digit hexadecimal color code.
 */
export function color(bgColor?: string): string {
  // Generate a random hue value between 0 and 360 (in degrees)
  const hue = Math.floor(Math.random() * 360);

  // Generate a random saturation value between 60% and 80%
  const saturation = randomInt(60, 80);

  // Calculate the lightness range based on the input background color
  const bgLightness = bgColor ? getLightness(bgColor) : 1.0;
  const range = bgLightness >= 0.5 ? [-45, -25] : [25, 45];

  // Generate a random lightness value within the calculated range
  const lightness = (
    Math.round(bgLightness * 100 + randomInt(range[0], range[1])) / 100
  ).toFixed(2);

  // Calculate the RGB values using the HSL-to-RGB conversion formula
  const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const rgb = hslToRgb(hsl);

  // Convert the RGB values to hexadecimal format and return the color value
  return `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Calculates the relative lightness of a color in the range from 0.0 (black) to 1.0 (white).
 *
 * @param {string} rgbColor The color to calculate the lightness of. Must be a valid 6-digit hexadecimal color code (with or without the "#" prefix).
 * @returns {number} The relative lightness of the color, in the range from 0.0 to 1.0.
 * @returns {number} `-1.0` if the input color is not a valid 6-digit hexadecimal color code.
 */
export function getLightness(rgbColor: string): number {
  const hexColor = rgbColor.startsWith("#") ? rgbColor.slice(1) : null;

  if (!hexColor || !/^[0-9A-Fa-f]{6}$/.test(hexColor)) return -1.0;

  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  return (max + min) / (2 * 255);
}

/**
 * Converts a hue value into its corresponding RGB value using the HSL-to-RGB conversion formula.
 *
 * @param {number} p The intermediate value used in the conversion formula.
 * @param {number} q The intermediate value used in the conversion formula.
 * @param {number} h The hue value (between 0 and 1).
 * @returns {number} The corresponding RGB value (between 0 and 1).
 */

export function hue2rgb(p: number, q: number, h: number): number {
  const t = (h + 1) % 1;
  if (6 * t < 1) {
    return p + (q - p) * 6 * t;
  }
  if (2 * t < 1) {
    return q;
  }
  if (3 * t < 2) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}

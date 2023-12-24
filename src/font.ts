import { loadSync, PathCommand } from 'opentype.js'
import { assert } from 'console'
import { ICaptchaConfig } from './config'

/**
 * Loads a font from the given file path.
 * @param path - The file path to load the font from.
 * @returns The loaded font.
 */
export function loadFont(path: string) {
  const font = loadSync(path)
  return font
}

/**
 * Renders the given text using the specified configuration options.
 * @param text - The text to render.
 * @param options - The configuration options for rendering the text.
 * @returns An array of SVG path strings representing the rendered text.
 */
export function renderText(text: string, options: ICaptchaConfig) {
  const font = loadFont(options.fontPath)

  // Calculate spacing between characters
  const len = text.length
  const spacing = (options.width - 2) / (len + 1)

  // Render each character as a path string and add it to the output array
  let i = -1
  const out = []
  while (++i < len) {
    const x = spacing * (i + 1)
    const y = options.height / 2
    const charPath = renderCharacter(
      text[i],
      font,
      Object.assign({ x, y }, options),
    )
    const color = options.textColor || '#000000'
    out.push(`<path fill="${color}" d="${charPath}"/>`)
  }

  return out
}

/**
 * Randomly modifies the coordinates of the given path command.
 * @param cmd - The path command to modify.
 * @returns The modified path command.
 */
function rndPathCmd(cmd: PathCommand) {
  const r = Math.random() * 0.2 - 0.1

  switch (cmd.type) {
    case 'M':
    case 'L':
      cmd.x! += r
      cmd.y! += r
      break
    case 'Q':
    case 'C':
      cmd.x! += r
      cmd.y! += r
      cmd.x1! += r
      cmd.y1! += r
      break
    default:
      // Close path cmd
      break
  }

  return cmd
}

type RenderOptions = ICaptchaConfig & {
  x: number
  y: number
}
export function renderCharacter(
  text: string,
  font: opentype.Font,
  opts: RenderOptions,
) {
  const ch = text[0]
  assert(ch, 'expect a string')

  const fontSize = opts.fontSize
  const fontScale = fontSize / font.unitsPerEm

  const glyph = font.charToGlyph(ch)
  const width = glyph.advanceWidth ? glyph.advanceWidth * fontScale : 0
  const left = opts.x - width / 2

  const height = (font.ascender + font.descender) * fontScale
  const top = opts.y + height / 2
  const path = glyph.getPath(left, top, fontSize)
  // Randomize path commands
  path.commands.forEach(rndPathCmd)

  const pathData = path.toPathData(2)

  return pathData
}

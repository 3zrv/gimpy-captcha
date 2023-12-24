import { ICaptchaConfig } from './config'
import { CaptchaCodeExpression } from './expressions/code-expression'
import { ICaptchaExpression } from './expressions/types'
import { renderText } from './font'
import { CaptchaMathExpression } from './expressions/math-expression'
import * as random from './random'
import { decrypt, keyToBuffer, verifySignature, encryptAndSign } from './crypto'
import * as errors from './errors'

export type ICaptcha = {
  /**
   * An unencrypted representation of the captcha
   */
  expr: string
  /**
   * An unencrypted string representation of the captcha
   */
  encryptedExpr: string
  /**
   * Captcha SVG
   */
  captchaSvg: string

  /**
   * Unix timestamp when the captcha expires (UTC)
   */
  validUntil: number
}

export function create(config: ICaptchaConfig): ICaptcha {
  let captcha: ICaptchaExpression

  switch (config.mode) {
    case 'code':
      captcha = CaptchaCodeExpression.generate(config.codeLength)
      break
    case 'math':
      captcha = CaptchaMathExpression.generate(2)
      break
    default:
      throw new Error(`unknown captcha mode ${config.mode}`)
  }

  const timestamp = Date.now() + config.captchaDuration
  const jsonToEncrypt = JSON.stringify({
    validUntil: timestamp,
    captcha: captcha.toObject(),
  })

  return {
    expr: jsonToEncrypt,
    encryptedExpr: encryptAndSign(
      jsonToEncrypt,
      config.cryptoKey,
      config.signatureKey,
    ),
    captchaSvg: renderCaptcha(captcha, config),
    validUntil: timestamp,
  }
}

export function verify(
  encryptedExpression: string,
  solution: string,
  key: string,
  signatureKey: string,
) {
  let captcha: ICaptchaExpression & { type: string }, validUntil: number
  try {
    const message = verifySignature(
      encryptedExpression,
      keyToBuffer(signatureKey),
    )
    // 1. Verify signature
    if (!message) {
      return errors.INVALID_DATA
    }

    const decrypted = decrypt(message, keyToBuffer(key))
    const parsed = JSON.parse(decrypted)

    captcha = parsed.captcha
    validUntil = parsed.validUntil
  } catch (e) {
    console.error(e)
    return errors.INVALID_DATA
  }

  const currentTimestamp = Date.now()
  if (validUntil <= currentTimestamp) {
    return errors.CAPTCHA_EXPIRED
  }

  switch (captcha.type) {
    case 'code':
      {
        const codeExpression = CaptchaCodeExpression.fromJSON(captcha)
        if (codeExpression.solve() === solution) {
          return true
        }
      }
      return errors.INVALID_SOLUTION
    case 'math':
      {
        const mathExpression = CaptchaMathExpression.fromJSON(captcha)

        if (mathExpression.solve().toString() === solution) {
          return true
        }
      }
      return errors.INVALID_SOLUTION
    default:
      throw new Error(`unknown captcha type ${captcha.type}`)
  }
}

/**
 * Takes an expression and returns an SVG string
 *
 * @param expression
 * @returns string SVG representation
 */
function renderCaptcha(
  expression: ICaptchaExpression,
  config: ICaptchaConfig,
): string {
  let background = ''
  let noise = ''
  const start = `<svg xmlns="http://www.w3.org/2000/svg" width="${150}" height="${80}" viewBox="0,0,${150},${80}">`

  if (config.backgroundColor) {
    background = `<rect width="100%" height="100%" fill="${config.backgroundColor}"/>`
  }

  noise = renderNoise(config).join('')

  const text = renderText(expression.toString(), config)
  const str = `${start}${background}${text}${noise}</svg>`
  return str
}

/**
 * Renders random noise lines and/or circles for a captcha image based on the provided options.
 *
 * @param {ICaptchaConfig} options The configuration options for the captcha image.
 * @returns {string[]} An array of SVG path strings for the rendered noise lines and/or circles.
 */
function renderNoise(options: ICaptchaConfig): string[] {
  if (!options.noise) return []

  const { width, height } = options
  const hasColor = options.backgroundColor
  const noiseShapes = []
  const minSize = 2
  const maxSize = 6

  for (let i = 0; i < options.noise; i++) {
    let shape

    const randomValue = Math.random()

    if (randomValue < 0.25) {
      // Generate a random vertical line segment using Bezier curves
      const start = `${random.int(1, width - 1)} ${random.int(1, 21)}`
      const end = `${random.int(1, width - 1)} ${random.int(
        height - 21,
        height - 1,
      )}`
      const mid1 = `${random.int(1, width - 1)} ${random.int(
        height / 4,
        height / 2,
      )}`
      const mid2 = `${random.int(1, width - 1)} ${random.int(
        height / 2,
        (height * 3) / 4,
      )}`
      const color = hasColor
        ? random.color(hasColor)
        : random.greyColor(minSize, maxSize)
      shape = `<path d="M${start} C${mid1},${mid2},${end}" stroke="${color}" fill="none"/>`
    } else if (randomValue < 0.5) {
      // Generate a random horizontal line segment using Bezier curves
      const start = `${random.int(1, width - 21)} ${random.int(1, height - 1)}`
      const end = `${random.int(width - 21, width - 1)} ${random.int(
        1,
        height - 1,
      )}`
      const mid1 = `${random.int(width / 4, width / 2)} ${random.int(
        1,
        height - 1,
      )}`
      const mid2 = `${random.int(width / 2, (width * 3) / 4)} ${random.int(
        1,
        height - 1,
      )}`
      const color = hasColor
        ? random.color(hasColor)
        : random.greyColor(minSize, maxSize)
      shape = `<path d="M${start} C${mid1},${mid2},${end}" stroke="${color}" fill="none"/>`
    } else if (randomValue < 0.75) {
      // Generate a lined circle
      const cx = random.int(1, width - 1)
      const cy = random.int(1, height - 1)
      const radius = random.int(minSize, maxSize)
      const color = hasColor
        ? random.color(hasColor)
        : random.greyColor(minSize, maxSize)
      shape = `<circle cx="${cx}" cy="${cy}" r="${radius}" stroke="${color}" fill="none"/>`
    } else {
      const character = random.tinyCharacter()
      const x = random.int(1, width - 1)
      const y = random.int(1, height - 1)
      const color = hasColor
        ? random.color(hasColor)
        : random.greyColor(minSize, maxSize)
      shape = `<text x="${x}" y="${y}" fill="${color}" font-size="${random.int(
        8,
        12,
      )}">${character}</text>`
    }

    noiseShapes.push(shape)
  }

  return noiseShapes
}

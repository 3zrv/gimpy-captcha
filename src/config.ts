import { resolve } from "path"
import { keyToBuffer } from "./crypto"

export type ILambdaCaptchaConfig = {
    /**
     * Path to OTF font file to use
     */
    fontPath: string,
    fontSize: number,
    /**
     * Mode of the captcha
     */
    mode: 'math' | 'code',
    /**
     * Key to encrypt the generated expression
     */
    cryptoKey: Buffer
    /**
     * Key to sign the encrypted message
     */
    signatureKey: Buffer
    /**
     * SVG width
     */
    width: number,
    /**
     * SVG height
     */
    height: number,
    /**
     * SVG Background color
     */
    backgroundColor?: string,
    /**
     * SVG Text color
     */
    textColor?: string,
    /**
     * Amount of noise 
     */
    noise?: number
    /**
     * Captcha should be valid until `Date.now() + captchaDuration`
     */
    captchaDuration: number
    /**
     * Length of generated code in 'code' mode
     */
    codeLength?: number
}

export class LambdaCaptchaConfigManager {
  static default(cryptoKey: string, signatureKey: string, mode: 'code' | 'math' = 'math'): ILambdaCaptchaConfig {
    return {
      fontPath: resolve(__dirname, '../fonts', 'FiraCode-Retina.otf'),
      fontSize: 40,
      mode: mode,
      width: 150,
      height: 85,
      noise: 25,
      cryptoKey: keyToBuffer(cryptoKey),
      signatureKey: keyToBuffer(signatureKey),
      captchaDuration: 180 * 1000
    }
  }
}

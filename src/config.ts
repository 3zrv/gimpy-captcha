import { resolve } from "path";
import { keyToBuffer } from "./crypto";

export type ICaptchaConfig = {
  /**
   * Path to OTF font file to use
   */
  fontPath: string;
  fontSize: number;
  /**
   * Mode of the captcha
   */
  mode: "math" | "code";
  /**
   * Key to encrypt the generated expression
   */
  cryptoKey: Buffer;
  /**
   * Key to sign the encrypted message
   */
  signatureKey: Buffer;
  /**
   * SVG width
   */
  width: number;
  /**
   * SVG height
   */
  height: number;
  /**
   * SVG Background color
   */
  backgroundColor?: string;
  /**
   * SVG Text color
   */
  textColor?: string;
  /**
   * Amount of noise
   */
  noise?: number;
  /**
   * Captcha should be valid until `Date.now() + captchaDuration`
   */
  captchaDuration: number;
  /**
   * Length of generated code in 'code' mode
   */
  codeLength?: number;
};

export class CaptchaConfigManager {
  /**
   * Returns the default configuration object with the option to override some properties.
   *
   * @param {Partial<ICaptchaConfig>} [config={}] - The configuration object with optional overrides.
   * @returns {ICaptchaConfig} The merged configuration object.
   */
  static default(config: Partial<ICaptchaConfig> = {}): ICaptchaConfig {
    const defaults: ICaptchaConfig = {
      fontPath: resolve(__dirname, "../fonts", "FiraCode-Bold.otf"),
      fontSize: 40,
      mode: "math",
      width: 150,
      height: 85,
      noise: 10,
      cryptoKey: keyToBuffer(""),
      signatureKey: keyToBuffer(""),
      captchaDuration: 180 * 1000,
    };

    return { ...defaults, ...config };
  }
}

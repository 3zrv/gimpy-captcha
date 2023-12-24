import { create, verify } from '../src/captcha'
import { CaptchaConfigManager, ICaptchaConfig } from '../src/config'
import { CaptchaMathExpression } from '../src/expressions/math-expression'
import { keyToBuffer } from '../src/crypto'
import * as errors from '../src/errors'

describe('create', () => {
  const captchaConfig: Partial<ICaptchaConfig> = {
    mode: 'code',
    cryptoKey: keyToBuffer('ezrvvv'),
    signatureKey: keyToBuffer('man0lett3'),
    noise: 20,
  }

  const config = CaptchaConfigManager.default(captchaConfig)
  config.captchaDuration = 5000
  const captcha = create(config)

  console.log(captcha)

  it('returns a Captcha instance', () => {
    expect(captcha.expr).toBeDefined()
    expect(captcha.encryptedExpr).toBeDefined()
    expect(captcha.captchaSvg).toBeDefined()
  })

  it('returns true on validating the answer', () => {
    expect(captcha.validUntil).toBeGreaterThan(0)
  })
})

describe('verify', () => {
  const encryptedCaptchaExpression =
    '6baf452edadda706928e4a994d5a6faa512c63959e6b0c5ec46ec5687f1d2c20$c85b4a5408d15e5b141eafd0afe2c93d:57e00308a0f6bcac1bcedde904e6c10de8bbd4b7696af10e0fe386a3b1f69b7102903b8dac2a30088ece3b848b682bbdd9fc10e0ed1f4d177b4f578995cea76a84f0731835f1e3e93190782f8e0beacd070b0bb2f99a821ecb3f25ec73046b4f'
  const secret = 'ezrvvv'
  const signatureKey = 'man0lett3'

  it('returns false when the captcha has expired', () => {
    const result = verify(encryptedCaptchaExpression, '7', secret, signatureKey)

    console.log(result)
    expect(result).toBe(errors.CAPTCHA_EXPIRED)
  })

  it('returns true on success', () => {
    const captchaConfig: Partial<ICaptchaConfig> = {
      mode: 'math',
      cryptoKey: keyToBuffer('ezrvvv'),
      signatureKey: keyToBuffer('man0lett3'),
      noise: 20,
    }
    const config = CaptchaConfigManager.default(captchaConfig)
    config.captchaDuration = 10 * 1000

    const captcha = create(config)
    const solution = CaptchaMathExpression.fromJSON(
      JSON.parse(captcha.expr).captcha,
    ).solve()

    const result = verify(
      captcha.encryptedExpr,
      solution.toString(),
      'ezrvvv',
      signatureKey,
    )

    expect(result).toBeTruthy()
  })

  it('returns false on error', () => {
    const config = CaptchaConfigManager.default()
    config.captchaDuration = 10 * 1000

    const captcha = create(config)

    const result = verify(captcha.encryptedExpr, '999', 'ezrvvv', signatureKey)

    expect([errors.INVALID_SOLUTION, errors.INVALID_DATA]).toContain(result)
  })
})

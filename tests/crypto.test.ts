import { encryptAndSign, keyToBuffer, verifySignature } from '../src/crypto'

describe('encryptAndSign', () => {
  it('should add a signature to a message', () => {
    const key = keyToBuffer('ezrvvv')
    const signatureKey = keyToBuffer('man0lett3')
    const signed = encryptAndSign('foo', key, signatureKey)

    console.log(signed)

    expect(verifySignature(signed, signatureKey)).toBeTruthy()
  })
})

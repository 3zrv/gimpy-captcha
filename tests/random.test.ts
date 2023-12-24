import * as rand from '../src/random'

describe('randomInt', () => {
  it('should return a random integer between min and max (inclusive)', () => {
    const result = rand.randomInt(1, 10)
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(10)
  })

  it('should return an integer when min and max are the same', () => {
    const result = rand.randomInt(5, 5)
    expect(Number.isInteger(result)).toBe(true)
    expect(result).toEqual(5)
  })
})

describe('greyColor', () => {
  it('should return a string in hexadecimal format (#RRGGBB)', () => {
    const result = rand.greyColor()
    expect(result).toMatch(/^#[0-9]{6}$/)
  })
})

describe('color', () => {
  it('should return a string in hexadecimal format (#RRGGBB)', () => {
    const result = rand.color()
    expect(result).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})

describe('getLightness', () => {
  it('should handle input color with "#" prefix', () => {
    const result = rand.getLightness('#888888')
    expect(result).toBeCloseTo(0.53, 2)
  })

  it('should return -1.0 for invalid input color', () => {
    const result = rand.getLightness('#00')
    expect(result).toEqual(-1.0)
  })
})

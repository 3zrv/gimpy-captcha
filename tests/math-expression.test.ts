import {
  CaptchaMathExpression,
  ICaptchaMathExpressionOperators,
} from '../src/expressions/math-expression'

describe('CaptchaMathExpression', () => {
  it('can be turned into a string', () => {
    const expression = new CaptchaMathExpression([1, 2], ['+'])

    expect(expression.toString()).toBe('1+2')
  })

  describe('generate', () => {
    it('returns an CaptchaMathExpression', () => {
      const expression = CaptchaMathExpression.generate()

      expect(expression.operands).toHaveLength(2)
      expect(expression.operators).toHaveLength(1)
    })

    it('returns an ICaptchaMathExpression with the desired operand count', () => {
      const expression = CaptchaMathExpression.generate(4)

      expect(expression.operands).toHaveLength(4)
      expect(expression.operators).toHaveLength(3)
    })
  })

  describe('solve', () => {
    it('solves an expression', () => {
      const expression = new CaptchaMathExpression([5, 8], ['+'])

      expect(expression.solve()).toBe(13)
    })

    it('throws an error on unknown operators', () => {
      const expression = new CaptchaMathExpression(
        [5, 8],
        ['*' as Partial<ICaptchaMathExpressionOperators>],
      )

      expect(() => expression.solve()).toThrow()
    })
  })

  describe('fromJSON', () => {
    it('converts JSON back to a math expression', () => {
      const expression = new CaptchaMathExpression([5, 8, 11], ['+', '-'])
      const rebuilt = CaptchaMathExpression.fromJSON(
        JSON.parse(JSON.stringify(expression.toObject())),
      )

      expect(rebuilt).toBeInstanceOf(CaptchaMathExpression)
      expect(rebuilt.operators).toStrictEqual(expression.operators)
      expect(rebuilt.operands).toStrictEqual(expression.operands)
      expect(rebuilt.solve()).toBe(expression.solve())
    })
  })
})

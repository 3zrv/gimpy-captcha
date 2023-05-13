import { CaptchaCodeExpression } from "../src/expressions/code-expression";

describe("CaptchaCodeExpression", () => {
  it("can be turned into a string", () => {
    const expression = new CaptchaCodeExpression('abcde');

    expect(expression.toString()).toBe("abcde");
  });

  describe("generate", () => {
    it("returns an CaptchaCodeExpression", () => {
      const expression = CaptchaCodeExpression.generate();

      expect(expression.code).toHaveLength(5);
    });

    it("returns an CaptchaCodeExpression with the desired code length", () => {
      const expression = CaptchaCodeExpression.generate(4);

      expect(expression.code).toHaveLength(4);
    });
  });

  describe("solve", () => {
    it("solves an expression", () => {
      const expression = new CaptchaCodeExpression('abcde');

      expect(expression.solve()).toBe('abcde');
    });
  });
  
  describe("fromJSON", () => {
    it("converts JSON back to a code expression", () => {
      const expression = new CaptchaCodeExpression('abcde');
      const rebuilt = CaptchaCodeExpression.fromJSON(JSON.parse(JSON.stringify(expression.toObject())))
      
      expect(rebuilt).toBeInstanceOf(CaptchaCodeExpression)
      expect(rebuilt.code).toStrictEqual(expression.code)
      expect(rebuilt.solve()).toBe(expression.solve())
    });
  });
});

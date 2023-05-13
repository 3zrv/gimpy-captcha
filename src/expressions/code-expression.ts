import { ICaptchaExpression } from "./types";

export class CaptchaCodeExpression implements ICaptchaExpression {
  constructor(public readonly code: string) {}

  static generate(length = 5): CaptchaCodeExpression {
    const code = Math.random().toString(36).substr(2, length);

    return new CaptchaCodeExpression(code);
  }

  static fromJSON(o: object): CaptchaCodeExpression {
    return Object.setPrototypeOf(
      Object.assign({}, o),
      CaptchaCodeExpression.prototype
    );
  }

  public solve(): string {
    return this.code;
  }

  public toString() {
    return String(this.code);
  }

  public toObject() {
    return {
      type: "code",
      code: this.code,
    };
  }
}

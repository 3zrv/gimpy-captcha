export interface ICaptchaExpression {
  solve(): number | string
  toObject(): object | string
}

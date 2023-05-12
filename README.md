## Usage

### Generating a captcha

```js
const lambdaCaptcha = require("captcha");
const SECRET = process.env.CAPTCHA_SECRET;

function generateCaptcha() {
  const captchaConfig =
    lambdaCaptcha.LambdaCaptchaConfigManager.default(SECRET, 'code');
  const captcha = lambdaCaptcha.create(captchaConfig);

  return {
    // The captcha SVG that you can display inside e.g. a form
    captchaSvg: captcha.captchaSvg,

    // This is the un-encrypted expression of the captcha.
    captchaExpression: captcha.expr,

    // This is the encrypted expression of the captcha.
    // Pass it along with your server side verification requests.
    encryptedCaptchaExpression: captcha.encryptedExpr,
  };
}
```

### Verifying a captcha

```js
const lambdaCaptcha = require("captcha");
const SECRET = process.env.CAPTCHA_SECRET;

function verify(encryptedCaptchaExpression, captchaSolution) {
  const captchaResult = lambdaCaptcha.verify(
    captchaExpression,
    captchaSolution,
    SECRET
  );
  return captchaResult; // either true on success or false if the solution was wrong
}
```

## Testing

`npm run test`

or

`npm run tdd`

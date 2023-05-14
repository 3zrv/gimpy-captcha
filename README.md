## Usage

### Generating a captcha

```js
const Captcha = require("gimpy-captcha");

const captchaConfig = {
  mode: "math", // or code
  cryptoKey: "ezrvvv",
  signatureKey: "man0lett3",
  noise: 20,
};

function generateCaptcha() {
  const captchaConfig = Captcha.CaptchaConfigManager.default(captchaConfig);
  const captcha = Captcha.create(captchaConfig);

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
const Captcha = require("captcha");

function verify(encryptedCaptchaExpression, captchaSolution) {
  const captchaResult = Captcha.verify(
    captchaExpression,
    captchaSolution,
    "ezrvvv"
  );
  return captchaResult; // either true on success or false if the solution was wrong
}
```

## Testing

`npm run test`

or

`npm run test:tdd`

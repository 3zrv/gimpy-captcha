import { LambdaCaptchaConfigManager } from "./../src/config";
import { existsSync } from "fs";

describe("LambdaCaptchaConfigManager", () => {
  describe("default", () => {
    it("returns a config object", () => {
      expect(LambdaCaptchaConfigManager.default('', '')).toHaveProperty("fontPath");
    });
    
    it("returns a valid default font path", () => {
      expect(existsSync(LambdaCaptchaConfigManager.default('', '').fontPath)).toBeTruthy()
    });
  });
});

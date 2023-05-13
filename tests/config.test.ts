import { CaptchaConfigManager } from "./../src/config";
import { existsSync } from "fs";

describe("CaptchaConfigManager", () => {
  describe("default", () => {
    it("returns a config object", () => {
      expect(CaptchaConfigManager.default("")).toHaveProperty("fontPath");
    });

    it("returns a valid default font path", () => {
      expect(
        existsSync(CaptchaConfigManager.default("").fontPath)
      ).toBeTruthy();
    });
  });
});

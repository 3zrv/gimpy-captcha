import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
} from "crypto";
import { assert } from "console";

const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text: string, key: Buffer) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string, key: Buffer) {
  assert(text, "text argument is required");

  const textParts = text.split(":");
  if (textParts.length < 2) {
    throw new Error("invalid ciphertext (missing iv?)");
  }

  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export function encryptAndSign(
  data: string,
  key: Buffer,
  signatureKey: Buffer
) {
  const encrypted = encrypt(data, key);

  const cipher = createHmac("sha256", signatureKey);
  cipher.update(encrypted);

  return cipher.digest("hex") + "$" + encrypted;
}

export function verifySignature(data: string, signatureKey: Buffer) {
  try {
    const [signature, message] = data.split("$");

    const cipher = createHmac("sha256", signatureKey);
    cipher.update(message);

    if (signature === cipher.digest("hex")) {
      return message;
    }
  } catch (e) {
    return false;
  }

  return false;
}

export function keyToBuffer(cryptoKey: string) {
  return createHash("sha256").update(String(cryptoKey)).digest();
}

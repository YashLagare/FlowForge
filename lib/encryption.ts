import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY // Must be 256 bits (32 bytes hex)
const ALGORITHM = "aes-256-cbc"

// Ensure the key is exactly 32 bytes (256 bits).
const getKey = () => {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY environment variable is not set.")
  }
  const key = Buffer.from(ENCRYPTION_KEY, "hex")
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be a 32-byte hex string (64 characters).")
  }
  return key
}

export function encrypt(text: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return iv.toString("hex") + ":" + encrypted
}

export function decrypt(text: string): string {
  const key = getKey()
  const parts = text.split(":")
  const iv = Buffer.from(parts.shift()!, "hex")
  const encryptedText = Buffer.from(parts.join(":"), "hex")
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  let decrypted = decipher.update(encryptedText, undefined, "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

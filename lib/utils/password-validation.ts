import { AppError } from "./error-handler"

/**
 * Validate password strength
 * @param password The password to validate
 * @throws AppError if password is not strong enough
 */
export function validatePasswordStrength(password: string): void {
  if (!password || password.length < 8) {
    throw new AppError("Password must be at least 8 characters long", 400, "WEAK_PASSWORD")
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    throw new AppError("Password must contain at least one uppercase letter", 400, "WEAK_PASSWORD")
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    throw new AppError("Password must contain at least one lowercase letter", 400, "WEAK_PASSWORD")
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    throw new AppError("Password must contain at least one number", 400, "WEAK_PASSWORD")
  }

  // Check for at least one special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new AppError("Password must contain at least one special character", 400, "WEAK_PASSWORD")
  }
}

/**
 * Check if a password has been compromised using the Pwned Passwords API
 * @param password The password to check
 * @returns True if the password has been compromised, false otherwise
 */
export async function isPasswordCompromised(password: string): Promise<boolean> {
  try {
    const crypto = require("crypto")
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase()
    const prefix = sha1.substring(0, 5)
    const suffix = sha1.substring(5)

    // Use the Pwned Passwords API to check if the password has been compromised
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)

    if (!response.ok) {
      console.error("Failed to check password against Pwned Passwords API")
      return false // Fail open if the API is unavailable
    }

    const text = await response.text()
    const hashes = text.split("\r\n")

    // Check if the suffix is in the list of compromised passwords
    return hashes.some((hash) => hash.split(":")[0] === suffix)
  } catch (error) {
    console.error("Error checking password against Pwned Passwords API:", error)
    return false // Fail open if there's an error
  }
}


import { totp } from "otplib"
import QRCode from "qrcode"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { logSecurityEvent } from "@/lib/services/logging"

// Configure TOTP
totp.options = {
  digits: 6,
  step: 30,
  window: 1, // Allow 1 step before/after for clock drift
}

// Generate a secret for a user
export function generateTOTPSecret(): string {
  return totp.generateSecret()
}

// Generate a QR code for the secret
export async function generateTOTPQRCode(email: string, secret: string): Promise<string> {
  const serviceName = "ProductivityDashboard"
  const otpauth = totp.keyuri(email, serviceName, secret)

  return await QRCode.toDataURL(otpauth)
}

// Verify a TOTP token
export function verifyTOTP(token: string, secret: string): boolean {
  return totp.verify({ token, secret })
}

// Generate a TOTP token (for testing)
export function generateTOTP(secret: string): string {
  return totp.generate(secret)
}

// Enable 2FA for a user
export async function enableTwoFactor(userId: string, secret: string): Promise<void> {
  await db.update(users).set({ twoFactorSecret: secret, twoFactorEnabled: true }).where(eq(users.id, userId))

  await logSecurityEvent(userId, "TWO_FACTOR_ENABLED", {}, "info")
}

// Disable 2FA for a user
export async function disableTwoFactor(userId: string): Promise<void> {
  await db.update(users).set({ twoFactorSecret: null, twoFactorEnabled: false }).where(eq(users.id, userId))

  await logSecurityEvent(userId, "TWO_FACTOR_DISABLED", {}, "warning")
}

// Check if 2FA is enabled for a user
export async function isTwoFactorEnabled(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { twoFactorEnabled: true },
  })

  return !!user?.twoFactorEnabled
}


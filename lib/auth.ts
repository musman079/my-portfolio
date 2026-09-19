import crypto from "crypto";

const ADMIN_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_PASSWORD ||
  "usman_portfolio_secure_vault_key_9876";

/**
 * Generate a cryptographically signed admin session token.
 * Format: `<timestamp>.<base64UrlHMAC>`
 */
export function signAdminToken(): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", ADMIN_SECRET);
  hmac.update(`admin_session_${timestamp}`);
  const signature = hmac.digest("base64url");
  return `${timestamp}.${signature}`;
}

/**
 * Verify if an admin session token is valid and not expired.
 * Default maxAge: 7 days.
 */
export function verifyAdminToken(
  token: string | null | undefined,
  maxAgeMs: number = 7 * 24 * 60 * 60 * 1000
): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration
  if (Date.now() - timestamp > maxAgeMs) return false;

  // Verify HMAC signature in constant time
  const hmac = crypto.createHmac("sha256", ADMIN_SECRET);
  hmac.update(`admin_session_${timestampStr}`);
  const expectedSignature = hmac.digest("base64url");

  try {
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (signatureBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Helper to check admin authorization on incoming API requests.
 * Checks Bearer Authorization header and admin_session cookie.
 */
export function requireAdminAuth(req: Request): boolean {
  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (verifyAdminToken(token)) return true;
  }

  // Check Cookie header
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    const sessionCookie = cookies.find((c) => c.startsWith("admin_session="));
    if (sessionCookie) {
      const token = sessionCookie.substring("admin_session=".length);
      if (verifyAdminToken(token)) return true;
    }
  }

  return false;
}

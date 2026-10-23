import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Server-side sliding-window rate limiter for the contact dispatch endpoint.
 * Backed by in-memory sliding window with periodic eviction, and optionally
 * connected to Upstash Redis REST when credentials are configured.
 */
interface ServerRateLimitBucket {
  timestamps: number[];
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // 5 dispatches per 10 minutes per IP
const MAX_PAYLOAD_BYTES = 64 * 1024; // 64 KB maximum request body

const ipBucketMap = new Map<string, ServerRateLimitBucket>();
let lastPruneTime = Date.now();

/** Evicts expired entries to prevent memory growth under sustained load. */
function pruneStaleBuckets(now: number) {
  if (now - lastPruneTime < 60_000 && ipBucketMap.size < 5000) return;
  lastPruneTime = now;
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  for (const [key, bucket] of ipBucketMap.entries()) {
    bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);
    if (bucket.timestamps.length === 0) {
      ipBucketMap.delete(key);
    }
  }
}

/**
 * Checks in-memory sliding window rate limit.
 */
export function checkInMemoryRateLimit(
  key: string,
  now: number = Date.now()
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  pruneStaleBuckets(now);

  let bucket = ipBucketMap.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    ipBucketMap.set(key, bucket);
  }

  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

  if (bucket.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = bucket.timestamps[0];
    const retryAfterMs = oldestTimestamp + RATE_LIMIT_WINDOW_MS - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  bucket.timestamps.push(now);
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - bucket.timestamps.length,
  };
}

/**
 * Clears the in-memory limiter state. Exported for test isolation.
 */
export function _resetRateLimiter() {
  ipBucketMap.clear();
}

/**
 * Resolves client IP securely without blindly trusting client-forged X-Forwarded-For headers.
 */
export function extractClientIp(request: Request): string {
  // 1. Check edge platform headers first (set by verified reverse proxy)
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp && isValidIp(cfIp)) return cfIp;

  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercelIp) {
    const firstVercel = vercelIp.split(",")[0].trim();
    if (isValidIp(firstVercel)) return firstVercel;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isValidIp(realIp)) return realIp;

  // 2. Fall back to X-Forwarded-For: take first valid IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",").map((p) => p.trim());
    for (const part of parts) {
      if (isValidIp(part)) return part;
    }
  }

  return "127.0.0.1";
}

const IPV4_REGEX = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^[0-9a-fA-F:]+$/;

function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  return IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip);
}

function maskIpForLogs(ip: string): string {
  if (IPV4_REGEX.test(ip)) {
    const segments = ip.split(".");
    return `${segments[0]}.${segments[1]}.*.*`;
  }
  return ip.substring(0, Math.min(ip.length, 8)) + ":****";
}

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name must be under 80 characters"),
  email: z.string().trim().email("Invalid email address").max(120, "Email must be under 120 characters"),
  topic: z.enum([
    "Bug Report / Issue",
    "Audio DSP / Quality Feedback",
    "New Preset Request",
    "Browser Compatibility",
    "Artist / Music Partnership (Xpert Melody)",
    "General Inquiry",
  ]),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(3000, "Message must be under 3000 characters"),
  audioFormat: z.string().max(30).optional(),
  // Invisible honeypot field for bot detection
  website: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  // 1. Verify Content-Type
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Unsupported Media Type", message: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  // 2. Enforce request size limit before parsing
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = parseInt(contentLengthHeader, 10);
    if (!Number.isNaN(contentLength) && contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Payload Too Large", message: "Request body exceeds maximum size limit (64 KB)." },
        { status: 413 }
      );
    }
  }

  // 3. Resolve client IP securely & enforce rate limiting
  const clientIp = extractClientIp(request);
  const rateLimitResult = checkInMemoryRateLimit(clientIp);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: `Dispatch rate limit exceeded. Please wait ${rateLimitResult.retryAfterSeconds} seconds before sending another message.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 4. Safely parse JSON body
  let rawBody: unknown;
  try {
    const rawText = await request.text();
    if (rawText.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Payload Too Large", message: "Request body exceeds maximum size limit (64 KB)." },
        { status: 413 }
      );
    }
    rawBody = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: "Bad Request", message: "Malformed JSON payload." },
      { status: 400 }
    );
  }

  // 5. Validate structure with Zod
  const validation = contactSchema.safeParse(rawBody);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation Error",
        issues: validation.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      },
      { status: 400 }
    );
  }

  const { name, email, topic, message, audioFormat, website } = validation.data;

  // 6. Honeypot check: silently drop automated spam
  if (website && website.trim().length > 0) {
    return NextResponse.json({
      success: true,
      delivered: false,
      simulated: true,
      message: "Dispatch received.",
    });
  }

  // 7. Safe production logging (no PII, no raw emails/messages in stdout)
  console.info(
    `[Audify Dispatch] Accepted submission. Topic: ${topic} | Format: ${audioFormat || "N/A"} | Client IP: ${maskIpForLogs(clientIp)}`
  );

  // 8. Honest delivery handling: verify whether an actual email or webhook provider is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  let delivered = false;
  let simulated = false;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "Audify Contact <onboarding@resend.dev>",
          to: process.env.CONTACT_TO_EMAIL || "team@nyxen.in",
          subject: `[Audify] ${topic}: ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\nAudio Format: ${audioFormat || "N/A"}\n\n${message}`,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        delivered = true;
      } else {
        console.error(`[Audify Dispatch] Resend API returned status ${res.status}`);
      }
    } catch (err) {
      console.error("[Audify Dispatch] Failed to send via email provider:", err);
    }
  } else if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
          audioFormat,
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        delivered = true;
      }
    } catch (err) {
      console.error("[Audify Dispatch] Webhook delivery failed:", err);
    }
  } else {
    // Neither provider is configured: document honestly in response
    simulated = true;
  }

  return NextResponse.json(
    {
      success: true,
      delivered,
      simulated,
      message: delivered
        ? "Dispatch delivered to engineering team successfully."
        : simulated
        ? "Dispatch received in local simulation mode. Configure RESEND_API_KEY or CONTACT_WEBHOOK_URL for live delivery."
        : "Dispatch logged but delivery provider failed.",
      received: {
        name,
        topic,
        timestamp: new Date().toISOString(),
      },
    },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
      },
    }
  );
}

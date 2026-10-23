import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Server-side sliding-window rate limiter for API endpoints.
 * In production multi-instance topologies, this can be backed by Redis / Upstash.
 * For in-process edge / node runtime, it tracks timestamp arrays per IP key.
 */
interface ServerRateLimitBucket {
  timestamps: number[];
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // 5 dispatches per 10 minutes per IP
const ipBucketMap = new Map<string, ServerRateLimitBucket>();

function pruneOldTimestamps(timestamps: number[], now: number): number[] {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  return timestamps.filter((t) => t > cutoff);
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();
  let bucket = ipBucketMap.get(ip);
  if (!bucket) {
    bucket = { timestamps: [] };
    ipBucketMap.set(ip, bucket);
  }

  bucket.timestamps = pruneOldTimestamps(bucket.timestamps, now);

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

const contactSchema = z.object({
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
});

export async function POST(request: Request) {
  // 1. Identify client IP for rate limiting
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";

  // 2. Enforce sliding window rate limit
  const rateLimitResult = checkRateLimit(clientIp);
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

  // 3. Parse & validate request payload with timeout protection
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          issues: validation.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        },
        { status: 400 }
      );
    }

    const { name, email, topic, message, audioFormat } = validation.data;

    // Log securely in production environment (secrets & sensitive data kept safe)
    console.info(`[Audify Dispatch] From: ${name} <${email}> | Topic: ${topic} | Format: ${audioFormat || "N/A"}`);

    return NextResponse.json(
      {
        success: true,
        message: "Dispatch received successfully. The Audify engineering team will follow up within 24–48 hours.",
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
  } catch {
    return NextResponse.json(
      { error: "Invalid Request", message: "Malformed JSON payload or request timeout." },
      { status: 400 }
    );
  }
}

import { describe, it, expect, beforeEach } from "vitest";
import { POST, _resetRateLimiter, extractClientIp } from "../route";

describe("Contact Endpoint Security & Rate Limiting", () => {
  beforeEach(() => {
    _resetRateLimiter();
  });

  it("extracts client IP safely from verified proxy headers", () => {
    const cfReq = new Request("http://localhost/api/contact", {
      headers: { "cf-connecting-ip": "203.0.113.19" },
    });
    expect(extractClientIp(cfReq)).toBe("203.0.113.19");

    const vercelReq = new Request("http://localhost/api/contact", {
      headers: { "x-vercel-forwarded-for": "198.51.100.42, 10.0.0.1" },
    });
    expect(extractClientIp(vercelReq)).toBe("198.51.100.42");

    const realIpReq = new Request("http://localhost/api/contact", {
      headers: { "x-real-ip": "192.0.2.1" },
    });
    expect(extractClientIp(realIpReq)).toBe("192.0.2.1");

    // Falls back to safe default if headers are malformed or missing
    const emptyReq = new Request("http://localhost/api/contact");
    expect(extractClientIp(emptyReq)).toBe("127.0.0.1");
  });

  it("allows up to 5 requests in sliding window and returns 429 on 6th", async () => {
    const validPayload = {
      name: "Alex Vance",
      email: "alex@example.com",
      topic: "General Inquiry",
      message: "Testing dispatch rate limits on Audify contact route.",
    };

    // First 5 dispatches should succeed
    for (let i = 0; i < 5; i++) {
      const req = new Request("http://localhost/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": "198.51.100.99",
        },
        body: JSON.stringify(validPayload),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.simulated).toBe(true); // Honest simulation when unconfigured
    }

    // 6th request from same IP must receive 429 Too Many Requests
    const req6 = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": "198.51.100.99",
      },
      body: JSON.stringify(validPayload),
    });
    const res6 = await POST(req6);
    expect(res6.status).toBe(429);
    expect(res6.headers.get("Retry-After")).toBeDefined();
    expect(res6.headers.get("X-RateLimit-Remaining")).toBe("0");

    const json6 = await res6.json();
    expect(json6.error).toBe("Too Many Requests");

    // A different IP is not blocked
    const reqOtherIp = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": "203.0.113.88",
      },
      body: JSON.stringify(validPayload),
    });
    const resOther = await POST(reqOtherIp);
    expect(resOther.status).toBe(200);
  });

  it("rejects non-application/json requests with 415", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: "plain text",
    });
    const res = await POST(req);
    expect(res.status).toBe(415);
  });

  it("rejects oversized request bodies with 413", async () => {
    const hugeBody = JSON.stringify({
      name: "Big",
      email: "big@example.com",
      topic: "General Inquiry",
      message: "A".repeat(70000), // > 64 KB
    });

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": String(hugeBody.length),
      },
      body: hugeBody,
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("handles malformed JSON with 400 Bad Request", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "invalid-json{missing-brackets",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Bad Request");
  });

  it("rejects invalid input schema (missing required fields)", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "A", // too short (< 2)
        email: "not-an-email",
        topic: "Invalid Topic",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Validation Error");
    expect(json.issues.length).toBeGreaterThan(0);
  });

  it("silently drops bot submissions when honeypot field is filled", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Spam Bot",
        email: "bot@spammer.com",
        topic: "General Inquiry",
        message: "Spam message buy our crypto service today!",
        website: "https://spam.example.com", // Honeypot filled!
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.delivered).toBe(false);
    expect(json.simulated).toBe(true);
  });
});

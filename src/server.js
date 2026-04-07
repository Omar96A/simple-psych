import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";
const rateLimitBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;

function setSecurityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  next();
}

function apiRateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(key, { count: 1, startedAt: now });
    return next();
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    res.setHeader("Retry-After", String(Math.ceil((RATE_LIMIT_WINDOW_MS - (now - bucket.startedAt)) / 1000)));
    return res.status(429).json({ ok: false, error: "Too many requests" });
  }

  bucket.count += 1;
  next();
}

app.disable("x-powered-by");
app.use(setSecurityHeaders);
app.use(express.static(publicDir));
app.use("/api", apiRateLimit);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, host, () => {
  console.log(`Simple Psych listening on http://${host}:${port}`);
});

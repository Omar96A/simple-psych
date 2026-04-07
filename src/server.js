import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";

app.use(express.static(publicDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, host, () => {
  console.log(`Simple Psych listening on http://${host}:${port}`);
});

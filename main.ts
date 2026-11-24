import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const line =
  "I ran a handshake protocol on you. It returned: connection refused, heart accepted.";

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, line, "utf8");

// Read-back self-check: the file on disk must be byte-identical to the line.
const back = readFileSync(target, "utf8");
if (back !== line) {
  throw new Error("read-back mismatch: entry.txt does not match the winning line");
}
if (back.length < 1 || back.length > 200) {
  throw new Error(`entry length ${back.length} is outside the 1-200 gate`);
}
if (back.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
if (back.endsWith("\n") || back.endsWith("\r")) {
  throw new Error("entry must not end with a newline");
}
if (back.includes("\n") || back.includes("\r")) {
  throw new Error("entry must be exactly one line");
}
const digest = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`entry.txt written (${back.length} chars, sha256 ${digest})`);

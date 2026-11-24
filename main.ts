import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "One star. My Monday opened with a 45-minute 'quick sync', an inbox that answered itself, and a coffee machine that quit before I did.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
for (const ch of LINE) {
  if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
    throw new Error("entry must not contain control characters");
  }
}

writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("round-trip read-back mismatch");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  throw new Error("written byte length differs from the entry's UTF-8 length");
}

import * as path from "path";
import { CORPUS_ROOT } from "./config";

export function normalizePath(filePath: string): string {
  return path.relative(CORPUS_ROOT, filePath).replace(/\\/g, "/");
}

export function cleanType(typeText: string): string {
  return typeText
    .replace(/import\([^)]+\)\./g, "")
    .replace(/"[^"]+[/.][^"]*"/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

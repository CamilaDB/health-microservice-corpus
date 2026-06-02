export function detectLayer(relativePath: string): string {
  if (relativePath.includes(".service.")) return "service";
  if (relativePath.includes(".repository.")) return "repository";
  if (relativePath.includes(".controller.")) return "controller";
  return "unknown";
}

export function detectModule(relativePath: string): string {
  const match = relativePath.match(/src\/([^/]+)\//);
  return match ? match[1] : "unknown";
}

export function detectRange(ccm: number): "low" | "medium" | "high" {
  if (ccm <= 4) return "low";
  if (ccm <= 10) return "medium";
  return "high";
}

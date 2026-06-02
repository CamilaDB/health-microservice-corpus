import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cmd = process.argv[2];

const COMMANDS = {
  complexity: "commands/complexity-report.ts",
  functions: "commands/generate-functions.ts",
  bootstrap: "commands/bootstrap.ts",
} as const;

function run(file: string): void {
  const absPath = path.resolve(__dirname, file);

  const result = spawnSync("node", ["--import", "tsx", absPath], {
    stdio: "inherit",
    encoding: "utf-8",
  });

  if (result.status !== 0) {
    process.stderr.write(
      `\n[cli] "${file}" exited with status ${result.status}\n`,
    );
    process.exit(result.status ?? 1);
  }
}

if (!cmd || cmd === "help") {
  console.log(`
Usage: node cli.ts <command>

Commands:
  complexity   Generate complexity_report.json (human-readable, not a pipeline dep)
  functions    Parse services, compute CCM, extract deep context → service_functions.json
  bootstrap    Run bootstrapper (consumes service_functions.json)
  all          Run: complexity + functions + bootstrap in order
  help         Show this message
  `);
  process.exit(0);
}

// "all" runs complexity first (for the human report), then functions + bootstrap.
// functions no longer reads from complexity_report.json — CCM is computed in-memory —
// so the order only matters for producing a complete output/ folder.
if (cmd === "all") {
  run(COMMANDS.complexity);
  run(COMMANDS.functions);
  run(COMMANDS.bootstrap);
  process.exit(0);
}

if (cmd in COMMANDS) {
  run(COMMANDS[cmd as keyof typeof COMMANDS]);
  process.exit(0);
}

// Legacy alias kept for backwards compat with any scripts that called "extract"
if (cmd === "extract") {
  console.warn(
    '[cli] "extract" is deprecated — context is now embedded in "functions". Running "functions" instead.',
  );
  run(COMMANDS.functions);
  process.exit(0);
}

console.error(`[cli] Unknown command: "${cmd}". Run "help" for usage.`);
process.exit(1);

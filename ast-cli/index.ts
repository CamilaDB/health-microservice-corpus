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

console.error(`[cli] Unknown command: "${cmd}". Run "help" for usage.`);
process.exit(1);

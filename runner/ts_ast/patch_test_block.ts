import fs from "fs";
import { Project, SyntaxKind, Node } from "ts-morph";

const payload = JSON.parse(process.argv[2]);

const filePath: string = payload.file_path;
const testName: string = payload.test_name;
const describeName: string = payload.describe_name;
const tempPath: string = payload.temp_path;

if (!testName || !describeName) {
  throw new Error("Invalid payload: test_name and describe_name are required");
}

const newBlock = fs.readFileSync(tempPath, "utf-8");

const project = new Project();
const sourceFile = project.addSourceFileAtPath(filePath);

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — locate the describe(describeName, ...) wrapper
// ─────────────────────────────────────────────────────────────────────────────

function findDescribeBody(root: Node, name: string): Node | undefined {
  for (const call of root.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const expr = call.getExpression().getText();
    if (expr !== "describe") continue;

    const args = call.getArguments();
    if (args.length < 2) continue;

    const title = args[0]
      .getText()
      .replace(/^['"`]/, "")
      .replace(/['"`]$/, "");

    if (title === name) {
      return args[1];
    }
  }
  return undefined;
}

const describeBody = findDescribeBody(sourceFile, describeName);

if (!describeBody) {
  throw new Error(`Describe wrapper not found: ${describeName}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — find and replace it() / test() scoped inside the wrapper
// ─────────────────────────────────────────────────────────────────────────────

const calls = describeBody.getDescendantsOfKind(SyntaxKind.CallExpression);

let replaced = false;

for (const call of calls) {
  const exprText = call.getExpression().getText();
  if (exprText !== "it" && exprText !== "test") continue;

  const args = call.getArguments();
  if (args.length < 2) continue;

  const firstArg = args[0];
  if (!firstArg) continue;

  const name = firstArg
    .getText()
    .replace(/^['"`]/, "")
    .replace(/['"`]$/, "");

  if (name !== testName) continue;

  call.getParentOrThrow().replaceWithText(newBlock);
  replaced = true;
  break;
}

if (!replaced) {
  throw new Error(
    `Test block not found: '${testName}' inside describe '${describeName}'`,
  );
}

sourceFile.saveSync();

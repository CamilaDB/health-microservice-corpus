import { Project, SyntaxKind, Node } from "ts-morph";

const payload = JSON.parse(process.argv[2]);

const filePath: string = payload.file_path;
const testName: string = payload.test_name;
const describeName: string = payload.describe_name;

if (!testName || !describeName) {
  console.error("Invalid payload: test_name and describe_name are required");
  process.exit(1);
}

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
      // Return the callback (second argument), not the call itself
      return args[1];
    }
  }
  return undefined;
}

const describeBody = findDescribeBody(sourceFile, describeName);

if (!describeBody) {
  console.error(`Describe wrapper not found: ${describeName}`);
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — find it() / test() by title, scoped inside the wrapper
// ─────────────────────────────────────────────────────────────────────────────

const calls = describeBody.getDescendantsOfKind(SyntaxKind.CallExpression);

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

  // Return the ExpressionStatement (parent of the CallExpression)
  console.log(call.getParentOrThrow().getText());
  process.exit(0);
}

console.error(
  `Test block not found: '${testName}' inside describe '${describeName}'`,
);
process.exit(1);

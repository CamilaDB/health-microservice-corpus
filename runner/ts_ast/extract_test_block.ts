import { Project, SyntaxKind } from "ts-morph";

const payload = JSON.parse(process.argv[2]);

const filePath = payload.file_path;
const fullTestName = payload.test_name;

const targetTestName = fullTestName
  .split("›")
  .map((part: string) => part.trim())
  .pop();

if (!targetTestName) {
  console.error("Invalid test name");
  process.exit(1);
}

const project = new Project();

const sourceFile = project.addSourceFileAtPath(filePath);

const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

for (const call of calls) {
  const expression = call.getExpression();

  const expressionText = expression.getText();

  if (expressionText !== "it" && expressionText !== "test") {
    continue;
  }

  const args = call.getArguments();

  if (args.length < 2) {
    continue;
  }

  const firstArg = args[0];

  if (!firstArg) {
    continue;
  }

  const name = firstArg
    .getText()
    .replace(/^['"`]/, "")
    .replace(/['"`]$/, "");

  if (name !== targetTestName) {
    continue;
  }

  console.log(call.getParentOrThrow().getText());

  process.exit(0);
}

console.error(`Test block not found: ${targetTestName}`);

process.exit(1);

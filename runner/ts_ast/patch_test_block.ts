import fs from "fs";
import { Project, SyntaxKind } from "ts-morph";

const payload = JSON.parse(process.argv[2]);

const filePath = payload.file_path;
const fullTestName = payload.test_name;
const tempPath = payload.temp_path;

const targetTestName = fullTestName
  .split("›")
  .map((part: string) => part.trim())
  .pop();

if (!targetTestName) {
  throw new Error("Invalid test name");
}

const newBlock = fs.readFileSync(tempPath, "utf-8");

const project = new Project();

const sourceFile = project.addSourceFileAtPath(filePath);

const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

let replaced = false;

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

  call.getParentOrThrow().replaceWithText(newBlock);

  replaced = true;

  break;
}

if (!replaced) {
  throw new Error(`Test block not found: ${targetTestName}`);
}

sourceFile.saveSync();

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { MethodDeclaration, SyntaxKind } from "ts-morph";

import { createProject, loadServiceFiles } from "../core/project";
import { cleanType, normalizePath } from "../core/utils";
import { detectLayer, detectModule, detectRange } from "../core/detect";
import { calcCCM } from "../core/complexity";
import { extractFunctionContext } from "../core/extractor";
import { FUNCTIONS_PATH } from "../core/config";

function getVisibility(
  method: MethodDeclaration,
): "public" | "protected" | "private" {
  if (method.hasModifier(SyntaxKind.PrivateKeyword)) return "private";
  if (method.hasModifier(SyntaxKind.ProtectedKeyword)) return "protected";
  return "public";
}

function sourceHash(filePath: string): string {
  const content = fs.readFileSync(filePath, "utf-8");
  return crypto.createHash("md5").update(content).digest("hex").slice(0, 8);
}

const project = createProject();
const files = loadServiceFiles(project);

const functions: unknown[] = [];

for (const file of files) {
  const relativePath = normalizePath(file.getFilePath());
  const absolutePath = file.getFilePath();

  const module = detectModule(relativePath);
  const layer = detectLayer(relativePath);
  const hash = sourceHash(absolutePath);

  for (const cls of file.getClasses()) {
    const className = cls.getName() ?? "Unknown";

    for (const method of cls.getMethods()) {
      const start = method.getStartLineNumber();
      const end = method.getEndLineNumber();
      const ccm = calcCCM(method);
      const range = detectRange(ccm);

      const context = extractFunctionContext(method, cls, file, project);

      functions.push({
        name: method.getName(),
        class_name: className,
        module,
        layer,
        source_file: relativePath,
        test_output_file: `src/${module}/${module}.${layer}.spec.ts`,
        line: start,
        end_line: end,
        loc: end - start + 1,
        source_hash: hash,
        is_async:
          method.isAsync() || method.getReturnType().getText().includes("Promise<"),
        visibility: getVisibility(method),
        parameters: method.getParameters().map((p) => ({
          name: p.getName(),
          type: cleanType(p.getType().getText()),
        })),
        return_type: cleanType(method.getReturnType().getText()),
        ccm,
        range,
        context,
      });
    }
  }
}

const outPath = path.resolve(process.cwd(), FUNCTIONS_PATH);
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const output = {
  generated_at: new Date().toISOString(),
  total: functions.length,
  functions,
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log(`Generated ${functions.length} functions → ${outPath}`);

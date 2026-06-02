/**
 * complexity-report
 *
 * Generates output/complexity_report.json for human inspection and
 * research documentation. NOT a dependency of generate-functions —
 * that step calculates CCM in-memory directly.
 */

import * as fs from "fs";
import { createProject, loadServiceFiles } from "../core/project";
import { normalizePath } from "../core/utils";
import { detectLayer, detectModule, detectRange } from "../core/detect";
import { calcCCM } from "../core/complexity";
import { CMM_PATH, OUTPUT_DIR } from "../core/config";

const project = createProject();
const files = loadServiceFiles(project);

const rows: {
  name: string;
  class_name: string;
  module: string;
  layer: string;
  ccm: number;
  range: "low" | "medium" | "high";
}[] = [];

for (const file of files) {
  const relativePath = normalizePath(file.getFilePath());
  const module = detectModule(relativePath);
  const layer = detectLayer(relativePath);

  for (const cls of file.getClasses()) {
    const class_name = cls.getName() ?? "Unknown";

    for (const method of cls.getMethods()) {
      const ccm = calcCCM(method);
      rows.push({
        name: method.getName(),
        class_name,
        module,
        layer,
        ccm,
        range: detectRange(ccm),
      });
    }
  }
}

rows.sort((a, b) => b.ccm - a.ccm);

const out = {
  generated_at: new Date().toISOString(),
  total: rows.length,
  high: rows.filter((r) => r.range === "high").length,
  medium: rows.filter((r) => r.range === "medium").length,
  low: rows.filter((r) => r.range === "low").length,
  functions: rows,
};

fs.mkdirSync(CMM_PATH, { recursive: true });
fs.writeFileSync(
  `${CMM_PATH}/complexity_report.json`,
  JSON.stringify(out, null, 2),
);

const csv = [
  "name,class_name,module,layer,ccm,range",
  ...rows.map(
    (r) =>
      `${r.name},${r.class_name},${r.module},${r.layer},${r.ccm},${r.range}`,
  ),
].join("\n");

fs.writeFileSync(`${CMM_PATH}/complexity_report.csv`, csv);

const html = `
<html>
<head>
<title>Complexity Report</title>
</head>
<body>
<h1>Service Complexity Report</h1>

<p>Total: ${rows.length}</p>
<p>High: ${out.high}</p>
<p>Medium: ${out.medium}</p>
<p>Low: ${out.low}</p>

<table border="1">
<tr>
<th>Method</th>
<th>Class</th>
<th>Module</th>
<th>CCM</th>
<th>Range</th>
</tr>

${rows
  .map(
    (r) => `
<tr>
<td>${r.name}</td>
<td>${r.class_name}</td>
<td>${r.module}</td>
<td>${r.ccm}</td>
<td>${r.range}</td>
</tr>`,
  )
  .join("")}

</table>
</body>
</html>
`;

fs.writeFileSync(`${CMM_PATH}/complexity_report.html`, html);

console.log(
  `Complexity report: ${rows.length} functions — high: ${out.high}, medium: ${out.medium}, low: ${out.low}`,
);

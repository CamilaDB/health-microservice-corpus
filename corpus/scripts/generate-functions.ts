import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface FunctionDefinition {
  name: string;
  module: string;
  layer: string;
  source_file: string;
  line: number;
  ccm: number;
  range: 'low' | 'medium' | 'high';
  dto_files: string[];
  enum_files: string[];
  test_output_file: string;
}

const output = execSync(
  'npx eslint --config complexity.config.mjs --format json',
  {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  },
);

const results = JSON.parse(output);

const functions: FunctionDefinition[] = [];

function normalizePath(filePath: string): string {
  return filePath
    .replace(process.cwd() + '\\', '')
    .replace(process.cwd() + '/', '')
    .replace(/\\/g, '/');
}

function detectLayer(relativePath: string): string {
  if (relativePath.includes('.service.')) {
    return 'service';
  }

  if (relativePath.includes('.repository.')) {
    return 'repository';
  }

  if (relativePath.includes('.controller.')) {
    return 'controller';
  }

  return 'unknown';
}

function detectModule(relativePath: string): string {
  const match = relativePath.match(/src\/([^/]+)\//);

  return match ? match[1] : 'unknown';
}

function detectComplexityRange(ccm: number): 'low' | 'medium' | 'high' {
  if (ccm <= 4) return 'low';

  if (ccm <= 10) return 'medium';

  return 'high';
}

function detectDtoFiles(relativePath: string): string[] {
  const dir = path.dirname(relativePath);

  const dtosDir = path.join(process.cwd(), dir, 'dto');

  if (!fs.existsSync(dtosDir)) {
    return [];
  }

  return fs
    .readdirSync(dtosDir)
    .filter((f) => f.endsWith('.dto.ts'))
    .map((f) => path.join(dir, 'dto', f).replace(/\\/g, '/'));
}

function detectEnumFiles(relativePath: string): string[] {
  const dir = path.dirname(relativePath);

  const enumsDir = path.join(process.cwd(), dir, 'enums');

  if (!fs.existsSync(enumsDir)) {
    return [];
  }

  return fs
    .readdirSync(enumsDir)
    .filter((f) => f.endsWith('.enum.ts'))
    .map((f) => path.join(dir, 'enums', f).replace(/\\/g, '/'));
}

for (const file of results) {
  const relativePath = normalizePath(file.filePath);

  const layer = detectLayer(relativePath);

  const moduleName = detectModule(relativePath);

  for (const msg of file.messages) {
    if (msg.ruleId !== 'complexity') {
      continue;
    }

    const match = msg.message.match(/['`](.+?)['`] has a complexity of (\d+)/);

    if (!match) {
      continue;
    }

    const [, fnName, ccmStr] = match;

    if (fnName === 'anonymous' || fnName.startsWith('anonymous:')) {
      continue;
    }

    const ccm = Number(ccmStr);

    const range = detectComplexityRange(ccm);

    functions.push({
      name: fnName,
      module: moduleName,
      layer,
      source_file: relativePath,
      line: msg.line,
      ccm,
      range,
      dto_files: detectDtoFiles(relativePath),
      enum_files: detectEnumFiles(relativePath),
      test_output_file: `src/${moduleName}/${moduleName}.${layer}.spec.ts`,
    });
  }
}

functions.sort((a, b) => b.ccm - a.ccm);

const outputPath = path.resolve(
  process.cwd(),
  '..',
  'runner',
  'data',
  'functions.json',
);

fs.mkdirSync(path.dirname(outputPath), {
  recursive: true,
});

fs.writeFileSync(outputPath, JSON.stringify(functions, null, 2));

console.log(`Generated functions.json with ${functions.length} functions`);

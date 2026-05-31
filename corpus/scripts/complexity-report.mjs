import { Project, SyntaxKind } from 'ts-morph';
import { resolve } from 'path';

// nós que incrementam CCM (McCabe)
const BRANCH_KINDS = new Set([
  SyntaxKind.IfStatement,
  SyntaxKind.ConditionalExpression, // ternário a ? b : c
  SyntaxKind.CaseClause, // case em switch
  SyntaxKind.CatchClause, // catch
  SyntaxKind.WhileStatement,
  SyntaxKind.ForStatement,
  SyntaxKind.ForInStatement,
  SyntaxKind.ForOfStatement,
  SyntaxKind.DoStatement,
  SyntaxKind.AmpersandAmpersandToken, // &&
  SyntaxKind.BarBarToken, // ||
  SyntaxKind.QuestionQuestionToken, // ??
  SyntaxKind.QuestionDotToken,
  SyntaxKind.QuestionQuestionToken,
  SyntaxKind.BarBarToken,
  SyntaxKind.AmpersandAmpersandToken,
]);

function calcCCM(node) {
  let ccm = 1;
  node.forEachDescendant((child) => {
    if (BRANCH_KINDS.has(child.getKind())) ccm++;
  });
  return ccm;
}

const project = new Project({
  tsConfigFilePath: resolve(process.cwd(), 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFilesAtPaths('src/**/*.service.ts');
// project.addSourceFilesAtPaths('src/**/*.repository.ts');

const rows = [];

for (const sf of project.getSourceFiles()) {
  const filePath = sf.getFilePath();
  const moduleMatch = filePath.match(/src[\\/](\w+)[\\/]/);
  const module = moduleMatch ? moduleMatch[1] : '?';

  const classes = sf.getClasses();
  for (const cls of classes) {
    for (const method of cls.getMethods()) {
      const name = method.getName();
      const isPrivate = method
        .getModifiers()
        .some((m) => m.getText() === 'private');
      const ccm = calcCCM(method);
      const range = ccm <= 4 ? 'baixa' : ccm <= 10 ? 'média' : 'alta';
      rows.push({ module, layer: 'service', name, ccm, range, isPrivate });
    }
  }
}

rows.sort((a, b) => b.ccm - a.ccm);

const pub = rows.filter((r) => !r.isPrivate);
const priv = rows.filter((r) => r.isPrivate);

const alta = pub.filter((r) => r.range === 'alta').length;
const media = pub.filter((r) => r.range === 'média').length;
const baixa = pub.filter((r) => r.range === 'baixa').length;

console.log('\n📊 Relatório de Complexidade Ciclomática — Corpus\n');
console.log(
  `${'Módulo'.padEnd(12)}${'Função'.padEnd(40)}${'CCM'.padEnd(6)}Faixa`,
);
console.log('─'.repeat(68));

for (const r of pub) {
  const flag = r.range === 'alta' ? '🔴' : r.range === 'média' ? '🟡' : '🟢';
  console.log(
    r.module.padEnd(12) +
      r.name.padEnd(40) +
      String(r.ccm).padEnd(6) +
      `${flag} ${r.range}`,
  );
}

if (priv.length > 0) {
  console.log('\n── Métodos privados (não são alvo do corpus) ──');
  for (const r of priv) {
    console.log(`  ${r.module.padEnd(12)}${r.name.padEnd(40)}${r.ccm}`);
  }
}

console.log('\n' + '─'.repeat(68));
console.log(`Total público: ${pub.length} funções\n`);
console.log(`🔴 Alta  (>10):  ${alta}`);
console.log(`🟡 Média (5-10): ${media}`);
console.log(`🟢 Baixa (1-4):  ${baixa}`);
console.log();

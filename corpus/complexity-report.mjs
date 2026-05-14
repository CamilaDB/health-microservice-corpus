import { execSync } from 'child_process';

const output = execSync(
  'npx eslint --config complexity.config.mjs --format json',
  { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
);

const results = JSON.parse(output);

const rows = [];

for (const file of results) {
  const relativePath = file.filePath
    .replace(process.cwd() + '\\', '')
    .replace(process.cwd() + '/', '');

  // extrai camada a partir do nome do arquivo
  const layer = relativePath.includes('.service.')
    ? 'service'
    : relativePath.includes('.repository.')
      ? 'repository'
      : 'controller';

  // extrai módulo
  const moduleMatch = relativePath.match(/src[\\/](\w+)[\\/]/);
  const module = moduleMatch ? moduleMatch[1] : '?';

  for (const msg of file.messages) {
    if (msg.ruleId !== 'complexity') continue;

    // extrai nome da função e CCM da mensagem
    const match = msg.message.match(/['`](.+?)['`] has a complexity of (\d+)/);
    if (!match) continue;

    const [, fnName, ccmStr] = match;
    const ccm = parseInt(ccmStr, 10);

    // ignora funções anônimas auxiliares (arrow functions internas)
    if (fnName === 'anonymous' || fnName.startsWith('anonymous:')) continue;

    const range = ccm <= 4 ? 'baixa' : ccm <= 10 ? 'média' : 'alta';

    rows.push({ module, layer, fnName, ccm, range });
  }
}

// ordena por CCM decrescente
rows.sort((a, b) => b.ccm - a.ccm);

// cabeçalho
console.log('\n📊 Relatório de Complexidade Ciclomática — Corpus\n');
console.log(
  'Módulo'.padEnd(12) +
    'Camada'.padEnd(12) +
    'Função'.padEnd(40) +
    'CCM'.padEnd(6) +
    'Faixa',
);
console.log('─'.repeat(76));

for (const r of rows) {
  const flag = r.range === 'alta' ? '🔴' : r.range === 'média' ? '🟡' : '🟢';
  console.log(
    r.module.padEnd(12) +
      r.layer.padEnd(12) +
      r.fnName.padEnd(40) +
      String(r.ccm).padEnd(6) +
      `${flag} ${r.range}`,
  );
}

console.log('─'.repeat(76));
console.log(`Total: ${rows.length} funções\n`);

// resumo por faixa
const alta = rows.filter((r) => r.range === 'alta').length;
const media = rows.filter((r) => r.range === 'média').length;
const baixa = rows.filter((r) => r.range === 'baixa').length;

console.log(`🔴 Alta  (>10): ${alta}`);
console.log(`🟡 Média (5-10): ${media}`);
console.log(`🟢 Baixa (1-4):  ${baixa}`);
console.log();

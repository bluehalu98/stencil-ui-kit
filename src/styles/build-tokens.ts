import fs from 'fs';
import path from 'path';

const tokensPath = path.resolve('src/styles/color.json');
const outputVarsPath = path.resolve('src/styles/variables.css');
const outputUtilsPath = path.resolve('src/styles/color-utilities.css');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

let cssVars = ':root {\n';
const bgUtils: string[] = [];
const textUtils: string[] = [];

/**
 * 토큰을 재귀적으로 순회하며 CSS 변수 및 유틸리티 클래스 생성
 */
function parseTokens(): void {
 for (const [key, value] of Object.entries(tokens)) {
  const varName = `--color-${key}`; // red_75 → --color-red_75
  cssVars += `  ${varName}: ${value};\n`;

  bgUtils.push(`.bg-${key} { background-color: var(${varName}, ${value}); }`);
  textUtils.push(`.text-${key} { color: var(${varName}, ${value}); }`);
 }
}

parseTokens();
cssVars += '}\n';

const cssUtils = '/* === Background Colors === */\n' + bgUtils.join('\n') + '\n\n/* === Text Colors === */\n' + textUtils.join('\n');

fs.writeFileSync(outputVarsPath, cssVars);
fs.writeFileSync(outputUtilsPath, cssUtils);

console.log(`✅ Generated:
  - ${outputVarsPath}
  - ${outputUtilsPath}`);

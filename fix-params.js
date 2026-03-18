const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('route.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('C:/projets/PORNHUB/src/app/api');
let modified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let initialContent = content;
  
  // This regex matches across newlines:
  // export async function GET(
  //   request: NextRequest,
  //   { params }: { params: { slug: string } }
  // ) {
  const regex = /export\s+async\s+function\s+([A-Z]+)\s*\(\s*(req|request)\s*:\s*(NextRequest|Request)\s*,\s*\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{([^}]+)\}\s*\}\s*\)\s*\{/g;
  
  content = content.replace(regex, (match, method, reqName, reqType, paramTypes) => {
    const paramNames = [];
    const attrRegex = /([a-zA-Z]+)\s*:\s*string/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(paramTypes)) !== null) {
      paramNames.push(attrMatch[1]);
    }
    const paramList = paramNames.join(', ');

    return `export async function ${method}(\n  ${reqName}: ${reqType},\n  { params }: { params: Promise<{ ${paramTypes.trim()} }> }\n) {\n  const resolvedParams = await params;\n  const { ${paramList} } = resolvedParams;\n`;
  });

  content = content.replace(/const\s+\{\s*([a-zA-Z,\s]+)\s*\}\s*=\s*params/g, '// replaced params destructuring');
  content = content.replace(/const\s+([a-zA-Z]+)\s*=\s*params\.([a-zA-Z]+)/g, '// replaced params access');

  if (content !== initialContent) {
    fs.writeFileSync(file, content);
    modified++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`Total files modified: ${modified}`);

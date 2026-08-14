const fs = require('fs');
const path = require('path');

// The dsh plugin ecosystem relies on implicit workspace-hoisted deps that are
// not declared in every package.json, so electron-builder prunes them.
// Restore any missing @deepseek-ai packages into the packed app.
exports.default = async function afterPack(context) {
  const scope = '@deepseek-ai';
  const src = path.join(__dirname, '..', 'node_modules', scope);
  const dst = path.join(context.appOutDir, 'resources', 'app', 'node_modules', scope);
  if (!fs.existsSync(src) || !fs.existsSync(dst)) return;
  let copied = 0;
  for (const name of fs.readdirSync(src)) {
    const target = path.join(dst, name);
    if (!fs.existsSync(target)) {
      fs.cpSync(path.join(src, name), target, { recursive: true });
      copied++;
    }
  }
  console.log('[afterPack] restored ' + copied + ' pruned ' + scope + ' packages');
};

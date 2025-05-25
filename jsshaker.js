const { treeShake } = require('@kermanx/tree-shaker');
const fs = require('fs');

const libName = process.env.LIB;

async function main() {
    const source = fs.readFileSync(`./rollup/${libName}.js`, 'utf-8');
    const { output, diagnostics } = treeShake(
        source,
        'recommended',
        true,
    );
    for (const diagnostic of diagnostics) {
        console.error(diagnostic);
    }
    if (!fs.existsSync('./jsshaker'))
        fs.mkdirSync('./jsshaker');
    fs.writeFileSync(`./jsshaker/${libName}.js`, output);
}

main();

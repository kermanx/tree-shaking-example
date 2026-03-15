import { globSync } from 'glob';

const files = globSync('**/*.js', { ignore: ['node_modules/**', 'dist/**'] });

console.log(files);

import { spawn } from 'node:child_process';

async function runCommand(depth: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', ['test', '-o', 'jsshaker,terser'], {
      cwd: import.meta.dirname + '/..',
      env: { ...process.env, REC_DEPTH: String(depth) },
      stdio: 'inherit', // This makes output stream in real-time
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runRecDepthSizes() {
  console.log('Running jsshaker with different recursion depths...\n');

  for (let depth = 1; depth <= 5; depth++) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running with REC_DEPTH=${depth}`);
    console.log('='.repeat(60) + '\n');

    try {
      await runCommand(depth);
      console.log(`\n✓ Completed depth ${depth}`);
    } catch (error: any) {
      console.error(`\n✗ Error at depth ${depth}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('All depths completed!');
  console.log('='.repeat(60));
}

runRecDepthSizes().catch(console.error);

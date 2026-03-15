## Prequisites

- Node.js 24.11+ with pnpm 10.30.3+
- Python 3.12.3+ with uv 0.9.11+
- Rust 1.91.1+ with Cargo 1.91.1+, Rustup 1.28.2+
- cloc 1.98+

```sh
# Install fnm (Node.js manager)
curl -fsSL https://fnm.vercel.app/install | bash

# Install uv (Python manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install rustup with specific toolchain 1.91.1
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain 1.91.1

# Load env into current shell session
source $HOME/.bashrc && source $HOME/.cargo/env

# Install and set Node.js 24.11
fnm install 24.11 && fnm default 24.11

# Enable corepack and install pnpm 10.30.3
corepack enable pnpm && corepack install -g pnpm@10.30.3

# Install Python 3.12.3 via uv
uv python install 3.12.3

# Install cloc for counting lines of code
sudo apt-get update && sudo apt-get install -y cloc
```

## Install Dependencies

```sh
pnpm i
pnpm -C src/packages/napi i
```

## Build JsShaker (NAPI)

```sh
pnpm -C src/packages/napi build
```

## Evaluation

```sh
CLOC=1 pnpm run test
CLOC=1 pnpm run prebuild:slidev-demo

pnpm run cloc # Count lines of code in the project
pnpm run test -o jsshaker/jsshaker2/gcc/gccAdv/lacuna2/lacuna3?,terser # All size data needed for the report
pnpm run verify -o jsshaker/jsshaker2/gcc/gccAdv/lacuna2/lacuna3?,terser # Verify the output of the above test runs
pnpm run performance # Measure build-time performance
pnpm run memory # Measure memory usage during build
pnpm run ablation # Measure the impact of individual optimizations in JsShaker
pnpm run stats # Generate data for function summary and property mangling
pnpm run gccMangling # Measure the impact of Google Closure Compiler's property mangling
pnpm run recDepthSizes # Impact of MaxRecDepth on output size
pnpm run performance benchmarkJsshaker # Impact of MaxRecDepth on build time
```

## Tables and Figures

```sh
node ./analysis/table_size.ts
node ./analysis/table_mangling.ts
node ./analysis/table_time.ts
node ./analysis/table_summary.ts

uv run ./analysis/figure_ablation.py # --> graphs/ablation_analysis.png
uv run ./analysis/figure_rec.py # --> graphs/depth_analysis.png
```

## Test262

```sh
mkdir -p src/tasks/test262/test262
curl -sSL https://github.com/tc39/test262/archive/b81b71eac270824739107588f26eb684a7729eb3.tar.gz | tar -xz -C src/tasks/test262/test262 --strip-components=1

pnpm -C src/tasks/test262 run test
```

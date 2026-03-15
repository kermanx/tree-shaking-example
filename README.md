## Repository Structure

- `analysis/` - Python and TypeScript scripts for generating tables and figures from experimental data
  - `table_*.ts` - Generate tables for paper (size, mangling, time, summary)
  - `figure_*.py` - Generate figures for paper (ablation, recursion depth analysis)
- `benchmarks/` - Test applications used for evaluation (antd, d3, lodash-es, react-icons, etc.)
- `data/` - Experimental results in JSON format (sizes, performance metrics, ablation data)
- `graphs/` - Generated figures (ablation_analysis.png, depth_analysis.png)
- `scripts/` - Build and evaluation scripts
  - `bundle.ts` - Bundle test applications
  - `jsshaker.ts` - JsShaker optimization runner
  - `cc.ts` - Google Closure Compiler runner
  - `lacuna.ts` - Lacuna optimizer runner
  - `performance.ts` - Build-time measurement
  - `memory.ts` - Memory usage measurement
  - `ablation.ts` - Ablation study runner
  - `stats.ts` - Function and property statistics
- `snapshots/` - Reference outputs for verification (`.orig.js` are baseline, `.js` are optimized)
- `src/` - Source code for JsShaker implementation
  - `crates/jsshaker/` - Rust implementation of JsShaker
  - `packages/napi/` - Node.js native addon for JsShaker
  - `packages/playground/` - Interactive playground
  - `packages/rollup-plugin/` - Rollup plugin integration
  - `tasks/` - Testing and benchmarking tasks
    - `benchmark/` - Performance benchmarking suite
    - `e2e/` - End-to-end integration tests
    - `test262/` - ECMAScript Test262 conformance tests
- `test/` - Test files for running optimized outputs
- `vendor/` - Third-party tools and comparison baselines
  - `JavaScriptHeuristicOptimizer/` - DFAHC - https://github.com/ffarzat/JavaScriptHeuristicOptmizer a5fcf60180b54c425c9c7bdedb55c1a1ac7030a4
  - `Lacuna/` - Lacuna - https://github.com/S2-group/Lacuna 9caffa5c6d347e2bb6a1a2103982a551def4bf84
  - `noVNC/` - noVNC - https://github.com/novnc/noVNC 6d0a9746657b085c11309dc5356083fcbb018526
  - `slidev-demo/` - Slidev demo application for benchmarking

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

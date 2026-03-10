import { spawn } from "child_process";
import { existsSync } from "fs";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { defineConfig } from "vite";


function ClocPlugin() {
  if (!process.env.CLOC) return null;
  const files = new Set<string>();
  return {
    name: "cloc-plugin",
    transform: {
      order: "pre" as const,
      handler(_code: string, id: string) {
        id = id.split("?")[0];
        id = id[0] === "\0" ? id.slice(1) : id;
        if (existsSync(id)) files.add(id);
        return null;
      },
    },
    async closeBundle() {
      const listPath = join(tmpdir(), `cloc-list-${Date.now()}.txt`);
      await writeFile(listPath, Array.from(files).join("\n"), "utf-8");
      const result = await new Promise<string>((resolve, reject) => {
        const child = spawn("cloc", ["--list-file", listPath, "--json", "--quiet"]);
        let out = "";
        child.stdout.on("data", (d: Buffer) => (out += d));
        child.on("close", (code: number) => (code === 0 ? resolve(out) : reject(new Error(`cloc exit ${code}`))));
        child.on("error", reject);
      });
      await unlink(listPath).catch(() => { });
      process.stdout.write(`\nCLOC_JSON_BEGIN\n${result}\nCLOC_JSON_END\n`);
    },
  };
}

export default defineConfig({
  plugins: [ClocPlugin()],
  build: {
    minify: false,
    // rollupOptions: {
    // output: {
    //   manualChunks: {},
    //   inlineDynamicImports: true,
    // },
    // },
  },
})
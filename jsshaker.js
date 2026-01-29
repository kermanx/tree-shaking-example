import fs from "fs";
import path from "path";

const distDir = path.join(import.meta.dirname, "dist");
// Adjust the executable path as needed based on your directory structure
const exePath = "D:/workspace/tree-shake/target/release/tree_shaker.exe";

const GZIP = true;

fs.readdir(distDir, (err, files) => {
  if (err) {
    console.error("Error reading the dist directory:", err);
    process.exit(1);
  }

  files = files.filter((file) => file.endsWith(".mjs"));

  const tasks = files.map(
    (file) =>
      new Promise((resolve) => {
        const fileArg = ".\\" + file;
        execFile(exePath, [
          fileArg,
          "--output", file.slice(0, -4),
          "-m",
        ], { cwd: distDir }, (error, stdout) => {
          if (error) {
            console.error(`Error processing ${file}:`, error);
            return resolve({ file, rate: null });
          }

          console.log(`Output for ${file}:\n${stdout}`);

          const sizeLine = stdout.split("\n").find((line) => line.includes(GZIP ? "[GZIP]" : "[RAW]"));

          const original = (sizeLine.match(/Copied: (\d+?)B/) || sizeLine.match(/\tMinified: (\d+)B/))[1];
          const shaken = (sizeLine.match(/Shaken: (\d+)B/) || sizeLine.match(/Shaken&Minified: (\d+)B/))[1];
          const rate = 100 - +sizeLine.match(/\tRate: ([\d.]+)%/)[1];
          const time = stdout.match(/Completed in (\S+)/)[1];

          resolve({
            file: file.slice(0, -4),
            time: time.endsWith("ms") ? +time.slice(0,-2) : +time.slice(0,-1) * 1000,
            original: +original,
            shaken: +shaken,
            rate,
          });
        });
      })
  );

  Promise.all(tasks).then((results) => {
    console.log("\nSummary Table:");
    console.table(results);


    results.sort((a, b) => - a.rate + b.rate);
    results.forEach((result) => {
      const { file, time, original, shaken, rate } = result;
      console.log(
        `| ${file} | ${rate.toFixed(2)}% | ${time.toFixed(0)}ms | ${original}B | ${shaken}B |`
      );
    });
  });
});

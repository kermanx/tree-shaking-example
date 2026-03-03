import { gzip } from 'zlib';
import { promisify } from 'util';
const gzipAsync = promisify(gzip);

export async function gzipSize(code: string) {
  const gzipped = await gzipAsync(code);
  return gzipped.length;
}

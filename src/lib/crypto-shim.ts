import { sha256 } from 'js-sha256';

export function createHash(algorithm: string) {
  if (algorithm !== 'sha256') throw new Error(`Unsupported algorithm: ${algorithm}`);
  let data = '';
  return {
    update(input: string) {
      data += input;
      return this;
    },
    digest(encoding: string) {
      if (encoding === 'hex') return sha256(data);
      throw new Error(`Unsupported encoding: ${encoding}`);
    },
  };
}

export function randomUUID(): string {
  return crypto.randomUUID();
}

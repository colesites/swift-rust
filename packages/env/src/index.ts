export type PublicEnv = Record<string, string | undefined>;

export const PUBLIC_PREFIX = "SWIFT_RUST_PUBLIC_";

export function loadPublicEnv(source: PublicEnv = process.env): PublicEnv {
  const out: PublicEnv = {};
  for (const [k, v] of Object.entries(source)) {
    if (k.startsWith(PUBLIC_PREFIX)) {
      out[stripPrefix(k)] = v;
    }
  }
  return out;
}

export function publicEnvKey(name: string): string {
  return `${PUBLIC_PREFIX}${name.toUpperCase()}`;
}

function stripPrefix(name: string): string {
  return name.startsWith(PUBLIC_PREFIX) ? name.slice(PUBLIC_PREFIX.length) : name;
}

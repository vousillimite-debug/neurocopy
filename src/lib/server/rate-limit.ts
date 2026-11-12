import "server-only";

/**
 * Limitation de débit par fenêtre fixe, en mémoire.
 * Suffisant sur une seule instance. En production multi-instances (étape 5),
 * remplacer le stockage par un magasin partagé (table Supabase ou Redis) : même interface.
 * On ne garde que la clé (outil + IP) et un compteur, jamais le texte.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  if (now - lastSweep > windowMs) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    lastSweep = now;
  }
  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  b.count++;
  const ok = b.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - b.count),
    retryAfterSeconds: ok ? 0 : Math.ceil((b.resetAt - now) / 1000),
  };
}

/** IP du client, telle que transmise par l'hébergeur (premier élément de x-forwarded-for). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "inconnue";
}

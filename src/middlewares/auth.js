
/**
 * Velmi jednoduchý middleware, který z requestu načte hlavičku Authorization.
 * Zatím jen zkontroluje, že existuje, a "předstírá" identitu uživatele.
 * Později se sem doplní skutečné ověření a čtení rolí.
 */
export function authMiddleware(req, res, next) {
  if (req.path.startsWith('/v1/health')) return next(); // health bez auth
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = auth.slice(7);
  // TODO: ověřit podpis a exp, vyčíst role/scope
  req.user = { id: 'demo-user', roles: ['USER'], token };
  next();
}

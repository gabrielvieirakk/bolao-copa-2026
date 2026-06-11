import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "bolao-dev-secret-change-me";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ erro: "Não autenticado." });
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

export function adminOnly(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ erro: "Acesso restrito ao admin." });
  next();
}

import jwt from "jsonwebtoken";
import { getUserById } from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET || "bolao-dev-secret-change-me";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ erro: "Não autenticado." });
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    const user = getUserById(payload.id);
    if (!user) return res.status(401).json({ erro: "Sessão expirada — faça login novamente." });
    req.user = { id: user.id, email: user.email, isAdmin: !!user.is_admin };
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

export function adminOnly(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ erro: "Acesso restrito ao admin." });
  next();
}

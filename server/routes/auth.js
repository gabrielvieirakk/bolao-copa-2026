import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "bolao-dev-secret-change-me";

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, isAdmin: !!user.is_admin }, JWT_SECRET, {
    expiresIn: "30d",
  });
}

// POST /api/auth/cadastrar
router.post("/cadastrar", async (req, res) => {
  const { email, nome, senha } = req.body || {};
  if (!email || !nome || !senha)
    return res.status(400).json({ erro: "Preencha e-mail, nome e senha." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return res.status(400).json({ erro: "E-mail inválido." });
  if (getUserByEmail(email))
    return res.status(409).json({ erro: "Já existe uma conta com esse e-mail. Faça login." });

  const hash = await bcrypt.hash(senha, 10);
  const user = createUser(email.trim(), nome.trim(), hash);
  return res.json({ token: makeToken(user), nome: user.nome, isAdmin: !!user.is_admin });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) return res.status(400).json({ erro: "Preencha e-mail e senha." });
  const user = getUserByEmail(email);
  if (!user) return res.status(401).json({ erro: "E-mail não encontrado. Crie uma conta." });
  const ok = await bcrypt.compare(senha, user.senha_hash);
  if (!ok) return res.status(401).json({ erro: "Senha incorreta." });
  return res.json({ token: makeToken(user), nome: user.nome, isAdmin: !!user.is_admin });
});

export default router;

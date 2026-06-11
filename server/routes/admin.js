import express from "express";
import { auth, adminOnly } from "../middleware.js";
import { upsertMatch, upsertResult, clearResult, setConfig, getDb, getAllUsers, deleteUser, updateUser } from "../db.js";

const router = express.Router();

// POST /api/admin/copa
router.post("/copa", auth, adminOnly, (req, res) => {
  const { copaComecou } = req.body;
  setConfig("copaComecou", !!copaComecou);
  return res.json({ ok: true });
});

// POST /api/admin/resultado
router.post("/resultado", auth, adminOnly, (req, res) => {
  const { matchId, m, v } = req.body || {};
  if (matchId === undefined || m === undefined || v === undefined)
    return res.status(400).json({ erro: "matchId, m e v são obrigatórios." });
  upsertResult(matchId, parseInt(m), parseInt(v), "admin");
  return res.json({ ok: true });
});

// DELETE /api/admin/resultado/:matchId
router.delete("/resultado/:matchId", auth, adminOnly, (req, res) => {
  clearResult(req.params.matchId);
  return res.json({ ok: true });
});

// POST /api/admin/knockout
router.post("/knockout", auth, adminOnly, (req, res) => {
  const { id, fase, mandante, visitante, kickoff } = req.body || {};
  if (!id || !fase || !mandante || !visitante || !kickoff)
    return res.status(400).json({ erro: "Campos: id, fase, mandante, visitante, kickoff." });
  upsertMatch({ id, fase, grupo: null, rodada: null, mandante, visitante, kickoff });
  return res.json({ ok: true });
});

// DELETE /api/admin/knockout/:id
router.delete("/knockout/:id", auth, adminOnly, (req, res) => {
  getDb().prepare("DELETE FROM matches WHERE id = ? AND fase != 'grupos'").run(req.params.id);
  return res.json({ ok: true });
});

// POST /api/admin/kickoff
router.post("/kickoff", auth, adminOnly, (req, res) => {
  const { matchId, kickoff } = req.body || {};
  if (!matchId || !kickoff) return res.status(400).json({ erro: "matchId e kickoff são obrigatórios." });
  getDb().prepare("UPDATE matches SET kickoff = ? WHERE id = ?").run(kickoff, matchId);
  return res.json({ ok: true });
});

// POST /api/admin/especiais-oficiais
router.post("/especiais-oficiais", auth, adminOnly, (req, res) => {
  const { especiais } = req.body || {};
  if (!especiais) return res.status(400).json({ erro: "especiais é obrigatório." });
  setConfig("especiaisOficiais", especiais);
  return res.json({ ok: true });
});

// GET /api/admin/users
router.get("/users", auth, adminOnly, (req, res) => {
  const users = getAllUsers().map((u) => ({
    id: u.id,
    nome: u.nome,
    email: u.email,
    isAdmin: !!u.is_admin,
    criadoEm: u.created_at,
  }));
  return res.json(users);
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", auth, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  if (id === req.user.id)
    return res.status(400).json({ erro: "Você não pode excluir sua própria conta." });
  deleteUser(id);
  return res.json({ ok: true });
});

// PUT /api/admin/users/:id
router.put("/users/:id", auth, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, isAdmin } = req.body || {};
  updateUser(id, { nome, email, isAdmin });
  return res.json({ ok: true });
});

// GET /api/admin/palpites — todos os palpites com nome do usuário e info do jogo
router.get("/palpites", auth, adminOnly, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT
      p.match_id, p.gols_m, p.gols_v, p.updated_at,
      u.id AS user_id, u.nome AS user_nome,
      m.mandante, m.visitante, m.kickoff, m.fase, m.grupo, m.rodada,
      r.gols_m AS res_m, r.gols_v AS res_v
    FROM predictions p
    JOIN users u ON u.id = p.user_id
    JOIN matches m ON m.id = p.match_id
    LEFT JOIN results r ON r.match_id = p.match_id
    ORDER BY m.kickoff, u.nome
  `).all();
  return res.json(rows);
});

// GET /api/admin/especiais-palpites — todos os especiais com nome do usuário
router.get("/especiais-palpites", auth, adminOnly, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT sb.user_id, sb.chave, sb.valor, u.nome AS user_nome
    FROM special_bets sb
    JOIN users u ON u.id = sb.user_id
    ORDER BY u.nome, sb.chave
  `).all();
  return res.json(rows);
});

export default router;

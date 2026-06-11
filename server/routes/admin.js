import express from "express";
import { auth, adminOnly } from "../middleware.js";
import { upsertMatch, upsertResult, clearResult, setConfig, getDb } from "../db.js";
import { syncResults } from "../sync.js";

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

// POST /api/admin/sync
router.post("/sync", auth, adminOnly, async (req, res) => {
  try {
    const atualizados = await syncResults();
    return res.json({ atualizados });
  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
});

export default router;

import express from "express";
import { auth } from "../middleware.js";
import {
  upsertPrediction, getPredictionsByUser,
  upsertSpecialBet, getSpecialBetsByUser,
  getMatch, getConfig, getDb,
} from "../db.js";

const router = express.Router();
const LOCK_ANTES_MS = 5 * 60 * 1000; // 5 min antes do kickoff

// GET /api/predictions  — palpites do usuário logado
router.get("/", auth, (req, res) => {
  const placares = getPredictionsByUser(req.user.id);
  const especiais = getSpecialBetsByUser(req.user.id);
  const placaresMap = Object.fromEntries(placares.map((p) => [p.match_id, { m: p.gols_m, v: p.gols_v }]));
  const especiaisMap = Object.fromEntries(especiais.map((e) => [e.chave, e.valor]));
  return res.json({ placares: placaresMap, especiais: especiaisMap });
});

// POST /api/predictions/placar  — salvar palpite de um jogo
router.post("/placar", auth, (req, res) => {
  const { matchId, m, v } = req.body || {};
  if (matchId === undefined || m === undefined || v === undefined)
    return res.status(400).json({ erro: "matchId, m e v são obrigatórios." });

  const jogo = getMatch(matchId);
  if (!jogo) return res.status(404).json({ erro: "Jogo não encontrado." });

  const kickoff = new Date(jogo.kickoff).getTime();
  if (Date.now() >= kickoff - LOCK_ANTES_MS)
    return res.status(409).json({ erro: "Palpite travado — menos de 5 minutos para o apito." });

  upsertPrediction(req.user.id, matchId, parseInt(m), parseInt(v));
  return res.json({ ok: true });
});

// POST /api/predictions/especiais  — salvar apostas especiais
router.post("/especiais", auth, (req, res) => {
  // Trava apenas quando o admin ativar "Copa começou"
  if (getConfig("copaComecou"))
    return res.status(409).json({ erro: "Apostas especiais encerradas pelo administrador." });

  const { especiais } = req.body || {};
  if (!especiais || typeof especiais !== "object")
    return res.status(400).json({ erro: "especiais deve ser um objeto." });

  for (const [chave, valor] of Object.entries(especiais)) {
    if (valor) upsertSpecialBet(req.user.id, chave, String(valor));
  }
  return res.json({ ok: true });
});

// GET /api/predictions/todos — todos os palpites (qualquer usuário logado)
router.get("/todos", auth, (req, res) => {
  const db = getDb();
  const placares = db.prepare(`
    SELECT p.match_id, p.gols_m, p.gols_v, p.updated_at,
           u.id AS user_id, u.nome AS user_nome,
           m.mandante, m.visitante, m.kickoff, m.fase, m.grupo,
           r.gols_m AS res_m, r.gols_v AS res_v
    FROM predictions p
    JOIN users u ON u.id = p.user_id
    JOIN matches m ON m.id = p.match_id
    LEFT JOIN results r ON r.match_id = p.match_id
    ORDER BY m.kickoff, u.nome
  `).all();
  const especiais = db.prepare(`
    SELECT sb.user_id, sb.chave, sb.valor, u.nome AS user_nome
    FROM special_bets sb
    JOIN users u ON u.id = sb.user_id
    ORDER BY u.nome, sb.chave
  `).all();
  return res.json({ placares, especiais });
});

export default router;

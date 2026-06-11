import express from "express";
import { auth } from "../middleware.js";
import {
  upsertPrediction, getPredictionsByUser,
  upsertSpecialBet, getSpecialBetsByUser,
  getMatch, getConfig, primeiroKickoffDaRodada,
} from "../db.js";
import { ESPECIAIS_DEADLINE } from "../../shared/data.js";

const router = express.Router();
const ABERTURA_DIAS = parseInt(process.env.ABERTURA_RODADA_DIAS || "5");
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

  const agora = Date.now();
  const kickoff = new Date(jogo.kickoff).getTime();

  // Trava 5 minutos antes do apito
  if (agora >= kickoff - LOCK_ANTES_MS)
    return res.status(409).json({ erro: "Palpite travado — menos de 5 minutos para o apito." });

  // Rodada precisa estar aberta (só grupos)
  if (jogo.fase === "grupos" && jogo.rodada) {
    const primeiroKick = primeiroKickoffDaRodada(jogo.fase, jogo.rodada);
    if (primeiroKick) {
      const abre = new Date(primeiroKick).getTime() - ABERTURA_DIAS * 86400 * 1000;
      if (agora < abre)
        return res.status(409).json({ erro: "Palpites desta rodada ainda não abriram." });
    }
  }

  upsertPrediction(req.user.id, matchId, parseInt(m), parseInt(v));
  return res.json({ ok: true });
});

// POST /api/predictions/especiais  — salvar apostas especiais
router.post("/especiais", auth, (req, res) => {
  const prazoPassou = Date.now() >= new Date(ESPECIAIS_DEADLINE).getTime();
  const copaComecou = getConfig("copaComecou") ?? false;
  if (prazoPassou || copaComecou)
    return res.status(409).json({ erro: "Apostas especiais encerradas — prazo era 11/06 às 16h." });

  const { especiais } = req.body || {};
  if (!especiais || typeof especiais !== "object")
    return res.status(400).json({ erro: "especiais deve ser um objeto." });

  for (const [chave, valor] of Object.entries(especiais)) {
    if (valor) upsertSpecialBet(req.user.id, chave, String(valor));
  }
  return res.json({ ok: true });
});

export default router;

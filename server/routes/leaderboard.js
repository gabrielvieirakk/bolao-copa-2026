import express from "express";
import { auth } from "../middleware.js";
import { getAllUsers, getAllPredictions, getAllSpecialBets, getAllResults, getAllMatches, getConfig } from "../db.js";
import { PONTOS, pontuarJogo, classePontuacao, norm } from "../../shared/scoring.js";
import { RODADAS, ESPECIAIS_DEFS } from "../../shared/data.js";

const router = express.Router();

// GET /api/leaderboard
router.get("/", auth, (req, res) => {
  const users = getAllUsers();
  const preds = getAllPredictions();
  const especiais = getAllSpecialBets();
  const results = getAllResults();
  const matches = getAllMatches();
  const especiaisOficiais = getConfig("especiaisOficiais") ?? {};

  const resultsMap = Object.fromEntries(results.map((r) => [r.match_id, { m: r.gols_m, v: r.gols_v }]));
  const matchesMap = Object.fromEntries(matches.map((m) => [m.id, m]));

  // Agrupa palpites por user
  const predsByUser = {};
  for (const p of preds) {
    if (!predsByUser[p.user_id]) predsByUser[p.user_id] = {};
    predsByUser[p.user_id][p.match_id] = { m: p.gols_m, v: p.gols_v };
  }

  // Agrupa especiais por user
  const especiaisByUser = {};
  for (const e of especiais) {
    if (!especiaisByUser[e.user_id]) especiaisByUser[e.user_id] = {};
    especiaisByUser[e.user_id][e.chave] = e.valor;
  }

  // Calcula ranking geral
  const linhas = users.map((u) => {
    const uPreds = predsByUser[u.id] || {};
    const uEsp = especiaisByUser[u.id] || {};
    let placaresPts = 0, exatos = 0, especiaisPts = 0;

    for (const [jid, palpite] of Object.entries(uPreds)) {
      const res = resultsMap[jid];
      const jogo = matchesMap[jid];
      if (res && jogo && PONTOS[jogo.fase]) {
        placaresPts += pontuarJogo(palpite, res, PONTOS[jogo.fase]);
        if (classePontuacao(palpite, res) === "exato") exatos++;
      }
    }

    for (const d of ESPECIAIS_DEFS) {
      const oficial = especiaisOficiais[d.key];
      const aposta = uEsp[d.key];
      if (oficial && aposta && norm(oficial) === norm(aposta)) {
        especiaisPts += d.pts;
      }
    }

    return {
      id: u.id, nome: u.nome, isAdmin: !!u.is_admin,
      placaresPts, especiaisPts, exatos,
      total: placaresPts + especiaisPts,
    };
  });

  // Craque da rodada
  const craques = RODADAS.map((r) => {
    const jogosRodada = matches.filter((j) => {
      if (r.key.startsWith("g")) {
        const num = parseInt(r.key[1]);
        return j.fase === "grupos" && j.rodada === num;
      }
      return j.fase === r.key;
    });
    const comResultado = jogosRodada.filter((j) => resultsMap[j.id]);
    if (comResultado.length === 0) return { key: r.key, label: r.label, status: "pendente", linhas: [] };

    const linhasRodada = users.map((u) => {
      const uPreds = predsByUser[u.id] || {};
      let pts = 0, exatos = 0;
      comResultado.forEach((j) => {
        const pa = uPreds[j.id];
        const res = resultsMap[j.id];
        if (pa && res && PONTOS[j.fase]) {
          pts += pontuarJogo(pa, res, PONTOS[j.fase]);
          if (classePontuacao(pa, res) === "exato") exatos++;
        }
      });
      return { id: u.id, nome: u.nome, pts, exatos };
    }).filter((l) => l.pts > 0).sort((a, b) => b.pts - a.pts || b.exatos - a.exatos);

    return {
      key: r.key, label: r.label,
      status: comResultado.length === jogosRodada.length ? "completa" : "andamento",
      total: jogosRodada.length, feitos: comResultado.length, linhas: linhasRodada,
    };
  });

  linhas.sort((a, b) => b.total - a.total || b.exatos - a.exatos);
  return res.json({ geral: linhas, craques });
});

export default router;

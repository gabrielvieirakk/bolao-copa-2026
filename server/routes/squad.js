import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { getSquad, saveSquad } from "../db.js";
import { JOGADORES, GOLEIROS } from "../../shared/data.js";

const router = express.Router();

// GET /api/squad?sel=Brasil&tipo=jogador
router.get("/", async (req, res) => {
  const { sel, tipo } = req.query;
  if (!sel) return res.status(400).json({ erro: "sel é obrigatório." });

  // 1. Tenta do cache
  const cached = getSquad(sel);
  if (cached) return res.json(filtrarPorTipo(cached, tipo));

  // 2. Fallback curado instantâneo enquanto busca
  const curados = tipo === "goleiro"
    ? GOLEIROS.filter((j) => j.s === sel).map((j) => ({ n: j.n, p: "GOL" }))
    : JOGADORES.filter((j) => j.s === sel).map((j) => ({ n: j.n, p: "" }));

  // 3. Busca assíncrona via Claude (se tiver API key)
  if (process.env.ANTHROPIC_API_KEY) {
    buscarElencoAsync(sel).catch(() => {});
  }

  return res.json(curados);
});

async function buscarElencoAsync(sel) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt =
    `Liste os jogadores da seleção de ${sel} para a Copa do Mundo de 2026 ` +
    `(convocação final; se ainda não saiu, o elenco mais provável). ` +
    `Responda APENAS um array JSON, sem texto fora dele: [{"n":"Nome","p":"GOL|DEF|MEI|ATA"}].`;
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{ role: "user", content: prompt }],
  });
  const txt = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const clean = txt.replace(/```json/gi, "").replace(/```/g, "").trim();
  const arr = JSON.parse((clean.match(/\[[\s\S]*\]/) || ["[]"])[0]);
  const limpo = arr.filter((x) => x?.n).map((x) => ({ n: String(x.n).trim(), p: String(x.p || "").toUpperCase() }));
  if (limpo.length) saveSquad(sel, limpo);
  return limpo;
}

function filtrarPorTipo(lista, tipo) {
  if (tipo === "goleiro") return lista.filter((x) => x.p === "GOL");
  return lista;
}

export default router;

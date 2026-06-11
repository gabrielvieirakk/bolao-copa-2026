import Anthropic from "@anthropic-ai/sdk";
import { getAllMatches, getAllResults, upsertResult, setConfig } from "./db.js";
import { JOGOS_GRUPOS } from "../shared/data.js";

export async function syncResults() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("[sync] ANTHROPIC_API_KEY não configurada — sync ignorado.");
    return 0;
  }

  const results = getAllResults();
  const resultados = Object.fromEntries(results.map((r) => [r.match_id, true]));
  const matches = getAllMatches();
  const agora = Date.now();

  const pendentes = matches
    .filter((j) => {
      if (resultados[j.id]) return false;
      const k = new Date(j.kickoff).getTime();
      return agora > k + 2 * 3600 * 1000; // mais de 2h após o kickoff
    })
    .slice(0, 16)
    .map((j) => ({
      id: j.id,
      mandante: j.mandante,
      visitante: j.visitante,
      data: new Date(j.kickoff).toLocaleDateString("pt-BR"),
    }));

  if (pendentes.length === 0) {
    console.log("[sync] Nenhum jogo pendente.");
    setConfig("lastSync", agora);
    return 0;
  }

  console.log("[sync] Buscando", pendentes.length, "placares...");
  const lista = pendentes.map((j) => `${j.id}: ${j.mandante} x ${j.visitante} (${j.data})`).join("\n");
  const prompt =
    `Busque na web o placar FINAL NO TEMPO REGULAMENTAR (90 minutos — IGNORE prorrogação e pênaltis) ` +
    `dos jogos da Copa do Mundo de 2026 abaixo. ` +
    `Responda APENAS um array JSON, sem texto fora dele: ` +
    `[{"id":"<id>","m":<gols mandante>,"v":<gols visitante>}]. ` +
    `Inclua só jogos já encerrados; omita os não disputados.\n\nJogos:\n${lista}`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{ role: "user", content: prompt }],
  });

  const txt = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const clean = txt.replace(/```json/gi, "").replace(/```/g, "").trim();
  let arr = [];
  try {
    arr = JSON.parse((clean.match(/\[[\s\S]*\]/) || ["[]"])[0]);
  } catch (e) {
    console.error("[sync] Erro ao parsear resposta:", e.message);
  }

  const validos = arr.filter((r) => r?.id && Number.isFinite(+r.m) && Number.isFinite(+r.v));
  for (const r of validos) upsertResult(r.id, +r.m, +r.v, "auto");
  setConfig("lastSync", agora);
  console.log("[sync]", validos.length, "resultado(s) salvos.");
  return validos.length;
}

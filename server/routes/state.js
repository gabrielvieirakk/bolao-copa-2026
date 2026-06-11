import express from "express";
import { getAllMatches, getAllResults, getConfig } from "../db.js";
import { ESPECIAIS_DEADLINE } from "../../shared/data.js";

const router = express.Router();

// GET /api/state  — estado público: jogos + resultados + config
router.get("/", (req, res) => {
  const matches = getAllMatches();
  const results = getAllResults();
  const resultsMap = Object.fromEntries(results.map((r) => [r.match_id, { m: r.gols_m, v: r.gols_v }]));

  const copaComecou = getConfig("copaComecou") ?? false;
  const especiaisOficiais = getConfig("especiaisOficiais") ?? {};
  const lastSync = getConfig("lastSync") ?? null;

  const espTravadas = Date.now() >= new Date(ESPECIAIS_DEADLINE).getTime() || copaComecou;
  return res.json({ matches, results: resultsMap, copaComecou, espTravadas, especiaisDeadline: ESPECIAIS_DEADLINE, especiaisOficiais, lastSync });
});

export default router;

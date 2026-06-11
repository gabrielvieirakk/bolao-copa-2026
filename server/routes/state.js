import express from "express";
import { getAllMatches, getAllResults, getConfig } from "../db.js";

const router = express.Router();

// GET /api/state  — estado público: jogos + resultados + config
router.get("/", (req, res) => {
  const matches = getAllMatches();
  const results = getAllResults();
  const resultsMap = Object.fromEntries(results.map((r) => [r.match_id, { m: r.gols_m, v: r.gols_v }]));

  const copaComecou = getConfig("copaComecou") ?? false;
  const especiaisOficiais = getConfig("especiaisOficiais") ?? {};
  const lastSync = getConfig("lastSync") ?? null;

  return res.json({ matches, results: resultsMap, copaComecou, especiaisOficiais, lastSync });
});

export default router;

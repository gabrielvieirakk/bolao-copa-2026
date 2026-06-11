import { JOGOS_GRUPOS } from "../shared/data.js";
import { upsertMatch, getAllMatches } from "./db.js";

const existing = getAllMatches();
if (existing.length === 0) {
  console.log("Inserindo", JOGOS_GRUPOS.length, "jogos de grupo...");
  for (const j of JOGOS_GRUPOS) upsertMatch(j);
  console.log("Seed concluído.");
} else {
  console.log("Banco já tem", existing.length, "jogos — seed ignorado.");
}

import { JOGOS_GRUPOS } from "../shared/data.js";
import { upsertMatch } from "./db.js";

// Sempre aplica o calendário oficial — qualquer redeploy corrige datas no banco
for (const j of JOGOS_GRUPOS) upsertMatch(j);
console.log(`Seed: ${JOGOS_GRUPOS.length} jogos sincronizados.`);

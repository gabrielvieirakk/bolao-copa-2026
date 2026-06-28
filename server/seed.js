import { JOGOS_GRUPOS, JOGOS_16AVOS } from "../shared/data.js";
import { upsertMatch } from "./db.js";

// Sempre aplica o calendário oficial — qualquer redeploy corrige datas no banco
const TODOS = [...JOGOS_GRUPOS, ...JOGOS_16AVOS];
for (const j of TODOS) upsertMatch(j);
console.log(`Seed: ${TODOS.length} jogos sincronizados (${JOGOS_GRUPOS.length} grupos + ${JOGOS_16AVOS.length} 16-avos).`);

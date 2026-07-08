import { JOGOS_GRUPOS, JOGOS_16AVOS, JOGOS_OITAVAS, JOGOS_QUARTAS } from "../shared/data.js";
import { upsertMatch } from "./db.js";

// Sempre aplica o calendário oficial — qualquer redeploy corrige datas no banco
const TODOS = [...JOGOS_GRUPOS, ...JOGOS_16AVOS, ...JOGOS_OITAVAS, ...JOGOS_QUARTAS];
for (const j of TODOS) upsertMatch(j);
console.log(`Seed: ${TODOS.length} jogos sincronizados (${JOGOS_GRUPOS.length} grupos + ${JOGOS_16AVOS.length} 16-avos + ${JOGOS_OITAVAS.length} oitavas + ${JOGOS_QUARTAS.length} quartas).`);

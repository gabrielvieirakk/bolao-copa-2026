import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";

import authRouter from "./routes/auth.js";
import stateRouter from "./routes/state.js";
import predictionsRouter from "./routes/predictions.js";
import leaderboardRouter from "./routes/leaderboard.js";
import squadRouter from "./routes/squad.js";
import adminRouter from "./routes/admin.js";
import { syncResults } from "./sync.js";

// Seed automático na primeira inicialização
import "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api/auth", authRouter);
app.use("/api/state", stateRouter);
app.use("/api/predictions", predictionsRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/squad", squadRouter);
app.use("/api/admin", adminRouter);

// Serve o frontend em produção
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Cron: sync às 8h (America/Sao_Paulo)
cron.schedule("0 8 * * *", () => {
  console.log("[cron] Rodando sync de resultados...");
  syncResults().catch((e) => console.error("[cron] Erro:", e.message));
}, { timezone: "America/Sao_Paulo" });

app.listen(PORT, () => {
  console.log(`Bolão rodando em http://localhost:${PORT}`);
});

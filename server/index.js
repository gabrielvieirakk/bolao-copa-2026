import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.js";
import stateRouter from "./routes/state.js";
import predictionsRouter from "./routes/predictions.js";
import leaderboardRouter from "./routes/leaderboard.js";
import squadRouter from "./routes/squad.js";
import adminRouter from "./routes/admin.js";

import "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/state", stateRouter);
app.use("/api/predictions", predictionsRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/squad", squadRouter);
app.use("/api/admin", adminRouter);

const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Bolão rodando em http://localhost:${PORT}`);
});

import express from "express";
import { JOGADORES, GOLEIROS } from "../../shared/data.js";

const router = express.Router();

// GET /api/squad?sel=Brasil&tipo=jogador
router.get("/", (req, res) => {
  const { sel, tipo } = req.query;
  if (!sel) return res.status(400).json({ erro: "sel é obrigatório." });

  const lista = tipo === "goleiro"
    ? GOLEIROS.filter((j) => j.s === sel).map((j) => ({ n: j.n, p: "GOL" }))
    : JOGADORES.filter((j) => j.s === sel).map((j) => ({ n: j.n, p: j.p || "" }));

  return res.json(lista);
});

export default router;

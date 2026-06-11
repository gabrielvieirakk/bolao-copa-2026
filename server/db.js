import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "bolao.db");

let _db;
export function getDb() {
  if (_db) return _db;
  _db = new DatabaseSync(DB_PATH);
  createSchema(_db);
  return _db;
}

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      email     TEXT UNIQUE NOT NULL,
      nome      TEXT NOT NULL,
      senha_hash TEXT NOT NULL,
      is_admin  INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS matches (
      id        TEXT PRIMARY KEY,
      fase      TEXT NOT NULL,
      grupo     TEXT,
      rodada    INTEGER,
      mandante  TEXT NOT NULL,
      visitante TEXT NOT NULL,
      kickoff   TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS results (
      match_id   TEXT PRIMARY KEY,
      gols_m     INTEGER NOT NULL,
      gols_v     INTEGER NOT NULL,
      origem     TEXT DEFAULT 'auto',
      updated_at INTEGER DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS predictions (
      user_id    INTEGER,
      match_id   TEXT NOT NULL,
      gols_m     INTEGER NOT NULL,
      gols_v     INTEGER NOT NULL,
      updated_at INTEGER DEFAULT (unixepoch()),
      PRIMARY KEY (user_id, match_id)
    );
    CREATE TABLE IF NOT EXISTS special_bets (
      user_id INTEGER,
      chave   TEXT NOT NULL,
      valor   TEXT NOT NULL,
      PRIMARY KEY (user_id, chave)
    );
    CREATE TABLE IF NOT EXISTS config (
      chave TEXT PRIMARY KEY,
      valor TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS squads (
      selecao    TEXT PRIMARY KEY,
      jogadores  TEXT NOT NULL,
      updated_at INTEGER DEFAULT (unixepoch())
    );
  `);
}

// ── users ──────────────────────────────────────────────────────────────────
export function getUserByEmail(email) {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
}
export function createUser(email, nome, senhaHash) {
  const db = getDb();
  const count = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
  const isFirst = count === 0;
  db.prepare(
    "INSERT INTO users (email, nome, senha_hash, is_admin) VALUES (?, ?, ?, ?)"
  ).run(email.toLowerCase(), nome, senhaHash, isFirst ? 1 : 0);
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
}
export function getAllUsers() {
  return getDb().prepare("SELECT id, email, nome, is_admin, created_at FROM users").all();
}
export function deleteUser(id) {
  const db = getDb();
  db.prepare("DELETE FROM predictions WHERE user_id = ?").run(id);
  db.prepare("DELETE FROM special_bets WHERE user_id = ?").run(id);
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
}
export function updateUser(id, { nome, email, isAdmin }) {
  const db = getDb();
  if (nome !== undefined) db.prepare("UPDATE users SET nome = ? WHERE id = ?").run(nome, id);
  if (email !== undefined) db.prepare("UPDATE users SET email = ? WHERE id = ?").run(email.toLowerCase(), id);
  if (isAdmin !== undefined) db.prepare("UPDATE users SET is_admin = ? WHERE id = ?").run(isAdmin ? 1 : 0, id);
}

// ── matches ────────────────────────────────────────────────────────────────
export function upsertMatch(m) {
  getDb().prepare(`
    INSERT INTO matches (id, fase, grupo, rodada, mandante, visitante, kickoff)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      fase=excluded.fase, grupo=excluded.grupo, rodada=excluded.rodada,
      mandante=excluded.mandante, visitante=excluded.visitante, kickoff=excluded.kickoff
  `).run(m.id, m.fase, m.grupo ?? null, m.rodada ?? null, m.mandante, m.visitante, m.kickoff);
}
export function getMatch(id) {
  return getDb().prepare("SELECT * FROM matches WHERE id = ?").get(id);
}
export function getAllMatches() {
  return getDb().prepare("SELECT * FROM matches ORDER BY kickoff").all();
}
export function primeiroKickoffDaRodada(fase, rodada) {
  const row = getDb().prepare(
    "SELECT MIN(kickoff) AS k FROM matches WHERE fase = ? AND rodada = ?"
  ).get(fase, rodada);
  return row?.k;
}

// ── results ────────────────────────────────────────────────────────────────
export function upsertResult(matchId, golsM, golsV, origem = "auto") {
  getDb().prepare(`
    INSERT INTO results (match_id, gols_m, gols_v, origem, updated_at)
    VALUES (?, ?, ?, ?, unixepoch())
    ON CONFLICT(match_id) DO UPDATE SET
      gols_m=excluded.gols_m, gols_v=excluded.gols_v,
      origem=excluded.origem, updated_at=excluded.updated_at
  `).run(matchId, golsM, golsV, origem);
}
export function getAllResults() {
  return getDb().prepare("SELECT * FROM results").all();
}
export function clearResult(matchId) {
  getDb().prepare("DELETE FROM results WHERE match_id = ?").run(matchId);
}

// ── predictions ────────────────────────────────────────────────────────────
export function upsertPrediction(userId, matchId, golsM, golsV) {
  getDb().prepare(`
    INSERT INTO predictions (user_id, match_id, gols_m, gols_v, updated_at)
    VALUES (?, ?, ?, ?, unixepoch())
    ON CONFLICT(user_id, match_id) DO UPDATE SET
      gols_m=excluded.gols_m, gols_v=excluded.gols_v, updated_at=excluded.updated_at
  `).run(userId, matchId, golsM, golsV);
}
export function getPredictionsByUser(userId) {
  return getDb().prepare("SELECT * FROM predictions WHERE user_id = ?").all(userId);
}
export function getAllPredictions() {
  return getDb().prepare("SELECT * FROM predictions").all();
}

// ── special bets ───────────────────────────────────────────────────────────
export function upsertSpecialBet(userId, chave, valor) {
  getDb().prepare(`
    INSERT INTO special_bets (user_id, chave, valor)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, chave) DO UPDATE SET valor=excluded.valor
  `).run(userId, chave, valor);
}
export function getSpecialBetsByUser(userId) {
  return getDb().prepare("SELECT * FROM special_bets WHERE user_id = ?").all(userId);
}
export function getAllSpecialBets() {
  return getDb().prepare("SELECT * FROM special_bets").all();
}

// ── config ─────────────────────────────────────────────────────────────────
export function getConfig(chave) {
  const row = getDb().prepare("SELECT valor FROM config WHERE chave = ?").get(chave);
  return row ? JSON.parse(row.valor) : null;
}
export function setConfig(chave, valor) {
  getDb().prepare(`
    INSERT INTO config (chave, valor) VALUES (?, ?)
    ON CONFLICT(chave) DO UPDATE SET valor=excluded.valor
  `).run(chave, JSON.stringify(valor));
}

// ── squads ─────────────────────────────────────────────────────────────────
export function getSquad(selecao) {
  const row = getDb().prepare("SELECT jogadores FROM squads WHERE selecao = ?").get(selecao);
  return row ? JSON.parse(row.jogadores) : null;
}
export function saveSquad(selecao, jogadores) {
  getDb().prepare(`
    INSERT INTO squads (selecao, jogadores, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(selecao) DO UPDATE SET jogadores=excluded.jogadores, updated_at=excluded.updated_at
  `).run(selecao, JSON.stringify(jogadores));
}

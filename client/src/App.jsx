import React, { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "./api.js";

/* ── Dados compartilhados (importados do shared/) ─────────────────────── */
// Em produção o Vite resolve estes imports via alias configurado no vite.config.js
import {
  GRUPOS, FLAGS, TODAS_SELECOES, FASES, FASE_LABEL, RODADAS,
  ESPECIAIS_DEFS, ESPECIAIS_DEADLINE, JOGADORES, GOLEIROS,
} from "../../shared/data.js";
import { PONTOS, pontuarJogo, classePontuacao, norm } from "../../shared/scoring.js";

const flag = (t) => FLAGS[t] || "🏳️";

/* ── Auth helpers ─────────────────────────────────────────────────────── */
function saveSession(token, nome, isAdmin) {
  localStorage.setItem("bolao_token", token);
  localStorage.setItem("bolao_nome", nome);
  localStorage.setItem("bolao_admin", isAdmin ? "1" : "0");
}
function loadSession() {
  const token = localStorage.getItem("bolao_token");
  const nome = localStorage.getItem("bolao_nome");
  const isAdmin = localStorage.getItem("bolao_admin") === "1";
  if (!token || !nome) return null;
  return { token, nome, isAdmin };
}
function clearSession() {
  localStorage.removeItem("bolao_token");
  localStorage.removeItem("bolao_nome");
  localStorage.removeItem("bolao_admin");
}

/* ── CSS ──────────────────────────────────────────────────────────────── */
const CSS = `
.bolao-root{
  --bg:#0b1220; --surface:#141c2e; --surface2:#1b2540; --line:#26324f;
  --pitch:#13c06a; --pitch-d:#0e9b55; --gold:#f5b82e; --chalk:#e8ecf3;
  --muted:#8492ac; --danger:#e5484d; --exato:#13c06a; --inter:#f5b82e; --min:#5a9bff;
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  background:var(--bg); color:var(--chalk); min-height:100vh;
}
.bolao-root *{box-sizing:border-box}
.mono{font-family:'Oswald','Archivo Narrow',system-ui,sans-serif;letter-spacing:.02em}
.wrap{max-width:920px;margin:0 auto;padding:0 16px 64px}
.topbar{position:sticky;top:0;z-index:20;background:linear-gradient(180deg,#0b1220,#0b1220ee);
  border-bottom:1px solid var(--line);backdrop-filter:blur(8px)}
.topbar-in{max-width:920px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{display:flex;align-items:center;gap:10px;min-width:0}
.led{display:flex;gap:3px}
.led i{width:5px;height:5px;border-radius:50%;background:var(--pitch);box-shadow:0 0 6px var(--pitch)}
.led i:nth-child(2){background:var(--gold);box-shadow:0 0 6px var(--gold)}
.led i:nth-child(3){background:var(--min);box-shadow:0 0 6px var(--min)}
.brand b{font-size:18px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.brand span{color:var(--gold)}
.who{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted)}
.who .nome{color:var(--chalk);font-weight:600}
.badge-admin{font-size:10px;text-transform:uppercase;letter-spacing:.08em;background:var(--gold);color:#1a1206;padding:2px 7px;border-radius:999px;font-weight:700}
.tabs{display:flex;gap:6px;overflow-x:auto;padding:14px 0 4px;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:0 0 auto;background:transparent;border:1px solid var(--line);color:var(--muted);padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;transition:.15s;white-space:nowrap}
.tab:hover{color:var(--chalk);border-color:#34466e}
.tab.on{background:var(--chalk);color:#0b1220;border-color:var(--chalk)}
.subtabs{display:flex;gap:4px;overflow-x:auto;padding:10px 0;scrollbar-width:none}
.subtabs::-webkit-scrollbar{display:none}
.subtab{flex:0 0 auto;background:transparent;border:none;color:var(--muted);padding:6px 12px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap}
.subtab.on{background:var(--surface2);color:var(--chalk)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:12px}
.card-top{display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:var(--muted);margin-bottom:12px}
.card-top .g{display:flex;align-items:center;gap:8px}
.chip{background:var(--surface2);padding:2px 8px;border-radius:6px;font-weight:600;letter-spacing:.04em}
.status-ok{color:var(--pitch);font-weight:700}
.status-lock{color:var(--muted)}
.match{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px}
.side{display:flex;align-items:center;gap:9px;min-width:0}
.side.r{justify-content:flex-end;text-align:right}
.side .fl{font-size:24px;line-height:1}
.side .nm{font-weight:600;font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.score{display:flex;align-items:center;gap:8px}
.stepper{display:flex;flex-direction:column;align-items:center;background:#0b1220;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.stepper button{background:transparent;border:none;color:var(--muted);cursor:pointer;font-size:12px;padding:2px 12px;line-height:1}
.stepper button:hover{color:var(--chalk)}
.stepper .val{font-family:'Oswald',sans-serif;font-size:26px;font-weight:600;color:var(--chalk);padding:1px 0;min-width:34px;text-align:center}
.x{color:var(--muted);font-weight:700}
.locked-score{font-family:'Oswald',sans-serif;font-size:26px;font-weight:600;background:#0b1220;border:1px solid var(--line);border-radius:10px;padding:4px 12px;min-width:42px;text-align:center}
.result-real{font-size:11px;color:var(--muted);text-align:center;margin-top:8px}
.result-real b{color:var(--chalk)}
.pillpts{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;margin-top:8px}
.pp-exato{background:rgba(19,192,106,.14);color:var(--exato)}
.pp-inter{background:rgba(245,184,46,.14);color:var(--inter)}
.pp-min{background:rgba(90,155,255,.14);color:var(--min)}
.pp-erro{background:rgba(229,72,77,.12);color:var(--danger)}
.confirm-row{display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:12px}
.btn{background:var(--surface2);color:var(--chalk);border:1px solid var(--line);border-radius:10px;padding:9px 16px;font-size:13.5px;font-weight:600;cursor:pointer;transition:.15s}
.btn:hover{border-color:#3a4d77}
.btn:disabled{opacity:.45;cursor:not-allowed}
.btn-primary{background:var(--pitch);border-color:var(--pitch);color:#04220f}
.btn-primary:hover:not(:disabled){background:var(--pitch-d);border-color:var(--pitch-d)}
.btn-gold{background:var(--gold);border-color:var(--gold);color:#1a1206}
.btn-ghost{background:transparent}
.inp{background:#0b1220;border:1px solid var(--line);border-radius:10px;color:var(--chalk);padding:10px 12px;font-size:14px;width:100%;outline:none}
.inp:focus{border-color:var(--pitch)}
select.inp{appearance:none}
.lbl{font-size:12px;color:var(--muted);margin-bottom:6px;display:block;font-weight:600}
.esp-grid{display:grid;grid-template-columns:1fr;gap:14px}
.esp-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px}
.esp-card .head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.esp-card .head h4{margin:0;font-size:15px}
.esp-pts{font-size:11px;color:var(--gold);font-weight:700;background:rgba(245,184,46,.1);padding:2px 8px;border-radius:999px}
.rank-row{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:8px}
.rank-pos{font-family:'Oswald',sans-serif;font-size:22px;font-weight:600;text-align:center;color:var(--muted)}
.rank-1 .rank-pos{color:var(--gold)} .rank-2 .rank-pos{color:#cbd5e1} .rank-3 .rank-pos{color:#cd7f32}
.rank-1{border-color:rgba(245,184,46,.5)}
.rank-name{font-weight:700;font-size:15px;display:flex;align-items:center;gap:8px}
.rank-sub{font-size:11.5px;color:var(--muted);margin-top:2px}
.rank-pts{font-family:'Oswald',sans-serif;font-size:24px;font-weight:600;color:var(--chalk)}
.rank-pts small{font-size:11px;color:var(--muted);font-family:'Inter';display:block;text-align:right;font-weight:600}
.tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:999px}
.tag-gold{background:rgba(245,184,46,.15);color:var(--gold)}
.note{background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:10px;padding:12px 14px;font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.5}
.note b{color:var(--chalk)}
.warn{border-left-color:var(--danger)}
.sync-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:14px 0 4px}
.sync-info{display:flex;align-items:center;gap:9px;font-size:12.5px;color:var(--muted);min-width:0}
.sync-info span{overflow:hidden;text-overflow:ellipsis}
.sync-dot{flex:0 0 auto;width:8px;height:8px;border-radius:50%;background:var(--pitch);box-shadow:0 0 6px var(--pitch)}
.sync-dot.pulse{animation:pulse 1s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
.cr-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:12px}
.cr-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.cr-head b{font-size:14px}
.cr-status{font-size:11px;color:var(--muted)}
.cr-winner{display:flex;align-items:center;gap:12px;background:linear-gradient(90deg,rgba(245,184,46,.12),transparent);border:1px solid rgba(245,184,46,.3);border-radius:12px;padding:12px 14px}
.cr-trophy{font-size:30px;line-height:1}
.cr-winner .nm{font-weight:700;font-size:16px}
.cr-winner .sub{font-size:12px;color:var(--muted);margin-top:2px}
.cr-winner .pts{margin-left:auto;font-family:'Oswald',sans-serif;font-size:26px;font-weight:600;color:var(--gold)}
.cr-rest{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.cr-chip{font-size:12px;color:var(--muted);background:var(--surface2);border-radius:999px;padding:4px 10px}
.cr-chip b{color:var(--chalk)}
.section-h{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:22px 0 12px;font-weight:700}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--pitch);color:#04220f;padding:10px 18px;border-radius:999px;font-weight:700;font-size:13px;z-index:50;box-shadow:0 8px 24px #0008}
.login-wrap{max-width:380px;margin:8vh auto 0;padding:0 16px}
.login-card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:26px}
.login-card h1{font-size:22px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em}
.login-card p{color:var(--muted);font-size:13px;margin:0 0 20px;line-height:1.5}
.field{margin-bottom:14px}
.seg{display:flex;background:#0b1220;border:1px solid var(--line);border-radius:10px;padding:3px;margin-bottom:18px}
.seg button{flex:1;background:transparent;border:none;color:var(--muted);padding:8px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer}
.seg button.on{background:var(--surface2);color:var(--chalk)}
.err{color:var(--danger);font-size:12.5px;margin-top:-6px;margin-bottom:12px}
.rule{display:flex;gap:14px;align-items:flex-start;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:10px}
.rule .stars{font-size:16px;flex:0 0 auto;width:64px}
.rule b{display:block;margin-bottom:2px}
.rule p{margin:0;font-size:13px;color:var(--muted);line-height:1.45}
@media(max-width:560px){.side .nm{font-size:13px}.match{gap:6px}.stepper .val,.locked-score{font-size:22px}}
`;

/* ── Componentes base ─────────────────────────────────────────────────── */
function Stepper({ value, onChange, disabled }) {
  return (
    <div className="stepper">
      <button aria-label="mais" disabled={disabled} onClick={() => onChange(Math.min((value ?? 0) + 1, 20))}>▲</button>
      <div className="val">{value ?? 0}</div>
      <button aria-label="menos" disabled={disabled} onClick={() => onChange(Math.max((value ?? 0) - 1, 0))}>▼</button>
    </div>
  );
}

function SelectJogador({ tipo, value, onChange, disabled }) {
  const selDoValue = (() => { const m = /\(([^)]+)\)\s*$/.exec(value || ""); return m ? m[1] : ""; })();
  const [sel, setSel] = useState(selDoValue);
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [outro, setOutro] = useState(false);

  useEffect(() => {
    if (!sel) { setLista([]); return; }
    setCarregando(true);
    api.get(`/api/squad?sel=${encodeURIComponent(sel)}&tipo=${tipo}`)
      .then((arr) => {
        setLista(arr.map((j) => ({ n: j.n })));
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, [sel, tipo]);

  if (outro) {
    return (
      <>
        <input className="inp" disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="Nome do jogador" />
        <button className="btn btn-ghost" style={{ marginTop: 8, padding: "6px 12px", fontSize: 12 }} disabled={disabled} onClick={() => { setOutro(false); onChange(""); }}>↩ usar a lista</button>
      </>
    );
  }

  return (
    <>
      <select className="inp" disabled={disabled} value={sel} onChange={(e) => { setSel(e.target.value); onChange(""); }}>
        <option value="">— seleção do jogador —</option>
        {TODAS_SELECOES.map((s) => <option key={s} value={s}>{flag(s)} {s}</option>)}
      </select>
      {sel && (
        <select className="inp" style={{ marginTop: 8 }} disabled={disabled} value={value || ""}
          onChange={(e) => { if (e.target.value === "__outro__") { setOutro(true); onChange(""); } else onChange(e.target.value); }}>
          <option value="">{carregando ? "carregando…" : "— escolha o jogador —"}</option>
          {lista.map((j) => <option key={j.n} value={`${j.n} (${sel})`}>{j.n}</option>)}
          <option value="__outro__">✏️ Outro (digitar)</option>
        </select>
      )}
    </>
  );
}

function MatchCard({ jogo, resultado, palpite, onSave, locked }) {
  const [m, setM] = useState(palpite?.m ?? 0);
  const [v, setV] = useState(palpite?.v ?? 0);
  const [dirty, setDirty] = useState(false);
  const [erroSave, setErroSave] = useState("");

  useEffect(() => {
    setM(palpite?.m ?? 0);
    setV(palpite?.v ?? 0);
    setDirty(false);
  }, [palpite, jogo.id]);

  const kd = new Date(jogo.kickoff);
  const dataFmt = isNaN(kd) ? "" : kd.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const cls = resultado ? classePontuacao(palpite, resultado) : null;
  const temPalpite = palpite && palpite.m !== undefined;

  return (
    <div className="card">
      <div className="card-top">
        <div className="g">
          {jogo.grupo && <span className="chip">Grupo {jogo.grupo}</span>}
          {!jogo.grupo && <span className="chip">{FASE_LABEL[jogo.fase]}</span>}
          <span>{dataFmt}</span>
        </div>
        {resultado ? (
          <span className="status-lock">Encerrado</span>
        ) : locked ? (
          <span className="status-lock">🔒 Palpites encerrados</span>
        ) : temPalpite ? (
          <span className="status-ok">✓ Palpite feito</span>
        ) : (
          <span className="status-lock">Preencha o placar</span>
        )}
      </div>

      <div className="match">
        <div className="side">
          <span className="fl">{flag(jogo.mandante)}</span>
          <span className="nm">{jogo.mandante}</span>
        </div>
        <div className="score">
          {locked || resultado ? (
            <><span className="locked-score">{palpite?.m ?? "–"}</span><span className="x">×</span><span className="locked-score">{palpite?.v ?? "–"}</span></>
          ) : (
            <>
              <Stepper value={m} onChange={(n) => { setM(n); setDirty(true); }} />
              <span className="x">×</span>
              <Stepper value={v} onChange={(n) => { setV(n); setDirty(true); }} />
            </>
          )}
        </div>
        <div className="side r">
          <span className="nm">{jogo.visitante}</span>
          <span className="fl">{flag(jogo.visitante)}</span>
        </div>
      </div>

      {resultado && (
        <div className="result-real">
          Resultado: <b>{jogo.mandante} {resultado.m} × {resultado.v} {jogo.visitante}</b>
        </div>
      )}

      {resultado && temPalpite && (
        <div style={{ textAlign: "center" }}>
          {cls === "exato" && <span className="pillpts pp-exato">🎯 Placar exato +{PONTOS[jogo.fase]?.exato}</span>}
          {cls === "inter" && <span className="pillpts pp-inter">Vencedor + saldo +{PONTOS[jogo.fase]?.inter}</span>}
          {cls === "min" && <span className="pillpts pp-min">Resultado certo +{PONTOS[jogo.fase]?.min}</span>}
          {cls === "erro" && <span className="pillpts pp-erro">Errou +0</span>}
        </div>
      )}

      {erroSave && (
        <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--danger)", textAlign: "center", fontWeight: 600 }}>
          ⚠️ {erroSave}
        </div>
      )}
      {!locked && !resultado && (
        <div className="confirm-row">
          {dirty && <span style={{ fontSize: 12, color: "var(--muted)" }}>não salvo</span>}
          <button className="btn btn-primary" onClick={async () => {
            setErroSave("");
            const r = await onSave({ m, v });
            if (r?.erro) setErroSave(r.erro);
            else setDirty(false);
          }}>
            {temPalpite ? "Atualizar palpite" : "Confirmar palpite"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── App principal ────────────────────────────────────────────────────── */
export default function App() {
  const [session, setSession] = useState(() => loadSession());
  const [gstate, setGstate] = useState(null);
  const [myPred, setMyPred] = useState({ placares: {}, especiais: {} });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("jogos");
  const [fase, setFase] = useState("grupos");
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }, []);

  // Carrega estado global
  useEffect(() => {
    api.get("/api/state")
      .then((s) => { setGstate(s); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Carrega palpites do usuário logado
  useEffect(() => {
    if (!session) return;
    api.get("/api/predictions")
      .then((p) => setMyPred(p))
      .catch(() => {});
  }, [session]);

  const todosJogos = gstate?.matches || [];

  const isLocked = useCallback((j) => {
    if (gstate?.results?.[j.id]) return true;
    const k = new Date(j.kickoff);
    return !isNaN(k) && Date.now() >= k.getTime() - 5 * 60 * 1000;
  }, [gstate]);

  async function handleAuth(mode, nome, email, senha) {
    try {
      let data;
      if (mode === "cadastrar") {
        data = await api.post("/api/auth/cadastrar", { nome, email, senha });
      } else {
        data = await api.post("/api/auth/login", { email, senha });
      }
      saveSession(data.token, data.nome, data.isAdmin);
      setSession({ token: data.token, nome: data.nome, isAdmin: data.isAdmin });
      return { ok: true };
    } catch (e) {
      return { erro: e.message };
    }
  }

  function logout() {
    clearSession();
    setSession(null);
    setMyPred({ placares: {}, especiais: {} });
    setTab("jogos");
  }

  async function salvarPlacar(jogoId, placar) {
    try {
      await api.post("/api/predictions/placar", { matchId: jogoId, m: placar.m, v: placar.v });
      setMyPred((p) => ({ ...p, placares: { ...p.placares, [jogoId]: placar } }));
      showToast("Palpite salvo ✓");
      return { ok: true };
    } catch (e) {
      showToast("Erro: " + e.message);
      return { erro: e.message };
    }
  }

  async function salvarEspeciais(esp) {
    try {
      await api.post("/api/predictions/especiais", { especiais: esp });
      setMyPred((p) => ({ ...p, especiais: esp }));
      showToast("Apostas especiais salvas ✓");
    } catch (e) {
      showToast("Erro: " + e.message);
    }
  }

  async function reloadState() {
    const s = await api.get("/api/state");
    setGstate(s);
  }

  if (loading) {
    return (
      <div className="bolao-root">
        <style>{CSS}</style>
        <div style={{ padding: "30vh 0", textAlign: "center", color: "var(--muted)" }}>Carregando…</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bolao-root">
        <style>{CSS}</style>
        <Login onAuth={handleAuth} />
      </div>
    );
  }

  const ehAdmin = session.isAdmin;

  return (
    <div className="bolao-root">
      <style>{CSS}</style>
      <header className="topbar">
        <div className="topbar-in">
          <div className="brand">
            <div className="led"><i /><i /><i /></div>
            <b>Bolão da <span>Copa</span> 2026</b>
          </div>
          <div className="who">
            {ehAdmin && <span className="badge-admin">admin</span>}
            <span className="nome">{session.nome}</span>
            <button className="btn btn-ghost" style={{ padding: "6px 12px" }} onClick={logout}>Sair</button>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="tabs">
          {[["jogos","Jogos"],["especiais","Apostas Especiais"],["palpites-todos","Palpites"],["ranking","Classificação"],["regras","Regras"]].map(([k,l]) => (
            <button key={k} className={"tab"+(tab===k?" on":"")} onClick={() => setTab(k)}>{l}</button>
          ))}
          {ehAdmin && <button className={"tab"+(tab==="admin"?" on":"")} onClick={() => setTab("admin")}>Admin</button>}
        </div>

        {tab === "jogos" && (
          <Jogos
            todosJogos={todosJogos} fase={fase} setFase={setFase}
            gstate={gstate} myPred={myPred} isLocked={isLocked}
            onSave={salvarPlacar}
          />
        )}
        {tab === "especiais" && (
          <Especiais myPred={myPred} onSave={salvarEspeciais}
            locked={gstate?.espTravadas ?? false}
            oficiais={gstate?.especiaisOficiais ?? {}}
          />
        )}
        {tab === "palpites-todos" && <TodosPalpites myNome={session.nome} gstate={gstate} />}
        {tab === "ranking" && <Ranking myId={session.nome} />}
        {tab === "regras" && <Regras />}
        {tab === "admin" && ehAdmin && <Admin gstate={gstate} onReload={reloadState} showToast={showToast} />}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ── Login ────────────────────────────────────────────────────────────── */
function Login({ onAuth }) {
  const [mode, setMode] = useState("cadastrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    setErro("");
    const r = await onAuth(mode, nome, email, senha);
    if (r.erro) setErro(r.erro);
    setBusy(false);
  }

  return (
    <div className="login-wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 18 }}>
        <div className="led"><i /><i /><i /></div>
        <b className="mono" style={{ fontSize: 20, textTransform: "uppercase", letterSpacing: ".06em" }}>
          Bolão da <span style={{ color: "var(--gold)" }}>Copa</span> 2026
        </b>
      </div>
      <div className="login-card">
        <h1>{mode === "entrar" ? "Bem-vindo de volta" : "Entre no bolão"}</h1>
        <p>Palpite nos placares, escolha campeão e artilheiro, e brigue pelo topo.</p>
        <div className="seg">
          <button className={mode === "entrar" ? "on" : ""} onClick={() => setMode("entrar")}>Entrar</button>
          <button className={mode === "cadastrar" ? "on" : ""} onClick={() => setMode("cadastrar")}>Criar conta</button>
        </div>
        {mode === "cadastrar" && (
          <div className="field">
            <label className="lbl">Seu nome (aparece no ranking)</label>
            <input className="inp" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Kako" />
          </div>
        )}
        <div className="field">
          <label className="lbl">E-mail</label>
          <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" onKeyDown={(e) => e.key === "Enter" && go()} />
        </div>
        <div className="field">
          <label className="lbl">Senha</label>
          <input className="inp" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••" onKeyDown={(e) => e.key === "Enter" && go()} />
        </div>
        {erro && <div className="err">{erro}</div>}
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy} onClick={go}>
          {busy ? "..." : mode === "entrar" ? "Entrar" : "Criar conta"}
        </button>
        {mode === "cadastrar" && (
          <p style={{ marginTop: 14, fontSize: 11.5 }}>
            👑 O primeiro a se cadastrar vira <b style={{ color: "var(--gold)" }}>admin</b> do bolão.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Jogos ────────────────────────────────────────────────────────────── */
function Jogos({ todosJogos, fase, setFase, gstate, myPred, isLocked, onSave }) {
  const abas = [...FASES, { key: "encerrados", label: "Encerrados" }];
  const lista = useMemo(() => {
    if (!gstate) return [];
    let js;
    if (fase === "encerrados") {
      js = todosJogos.filter((j) => gstate.results[j.id]);
    } else {
      js = todosJogos.filter((j) => j.fase === fase && !gstate.results[j.id]);
    }
    return js.slice().sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
  }, [todosJogos, fase, gstate]);

  return (
    <div>
      <div className="subtabs">
        {abas.map((f) => (
          <button key={f.key} className={"subtab"+(fase===f.key?" on":"")} onClick={() => setFase(f.key)}>{f.label}</button>
        ))}
      </div>

      {fase !== "encerrados" && (
        <div className="note">Palpite antes do apito. Só conta o <b>tempo regulamentar (90 min)</b>.</div>
      )}

      {lista.length === 0 && (
        <div className="note">
          {fase === "encerrados" ? "Nenhum jogo encerrado ainda." :
           fase === "grupos" ? "Sem jogos nesta fase." :
           "Os confrontos do mata-mata aparecem quando o admin cadastrá-los."}
        </div>
      )}

      {lista.map((j) => (
        <MatchCard
          key={j.id}
          jogo={j}
          resultado={gstate?.results?.[j.id] || null}
          palpite={myPred.placares[j.id]}
          locked={isLocked(j)}
          onSave={(p) => onSave(j.id, p)}
        />
      ))}
    </div>
  );
}

/* ── Especiais ────────────────────────────────────────────────────────── */
function Especiais({ myPred, onSave, locked, oficiais }) {
  const [esp, setEsp] = useState(myPred.especiais || {});
  useEffect(() => setEsp(myPred.especiais || {}), [myPred]);
  const set = (k, v) => setEsp((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <div className={"note" + (locked ? " warn" : "")}>
        {locked
          ? <>🔒 Prazo encerrado — apostas especiais <b>travadas desde 11/06 às 23h</b>.</>
          : <>⏰ <b>Prazo: 11/06/2026 às 23h (Brasília).</b> Depois disso, as apostas especiais travam automaticamente e não contam mais.</>}
      </div>
      <div className="esp-grid">
        {ESPECIAIS_DEFS.map((d) => {
          const acertou = oficiais?.[d.key] && esp[d.key] && norm(oficiais[d.key]) === norm(esp[d.key]);
          return (
            <div className="esp-card" key={d.key}>
              <div className="head"><h4>{d.label}</h4><span className="esp-pts">+{d.pts} pts</span></div>
              {d.tipo === "selecao" ? (
                <select className="inp" disabled={locked} value={esp[d.key] || ""} onChange={(e) => set(d.key, e.target.value)}>
                  <option value="">— escolha —</option>
                  {TODAS_SELECOES.map((s) => <option key={s} value={s}>{flag(s)} {s}</option>)}
                </select>
              ) : (
                <SelectJogador tipo={d.tipo} disabled={locked} value={esp[d.key] || ""} onChange={(v) => set(d.key, v)} />
              )}
              {oficiais?.[d.key] && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  Oficial: <b>{oficiais[d.key]}</b> {acertou ? <span className="pillpts pp-exato" style={{ marginTop: 0 }}>✓ +{d.pts}</span> : <span style={{ color: "var(--danger)" }}>✗</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!locked && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button className="btn btn-gold" onClick={() => onSave(esp)}>Salvar apostas especiais</button>
        </div>
      )}
    </div>
  );
}

/* ── Todos os Palpites (público) ─────────────────────────────────────── */
function TodosPalpites({ myNome, gstate }) {
  const [aba, setAba] = useState("jogos");
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/predictions/todos").then(setData).catch(() => setData({ placares: [], especiais: [] }));
  }, []);

  if (!data) return <div className="note">Carregando palpites…</div>;

  const { placares, especiais } = data;

  // Agrupar por jogo
  const porJogo = {};
  for (const p of placares) {
    if (!porJogo[p.match_id]) porJogo[p.match_id] = { info: p, apostas: [] };
    porJogo[p.match_id].apostas.push(p);
  }
  const jogosOrdenados = Object.values(porJogo).sort((a, b) => new Date(a.info.kickoff) - new Date(b.info.kickoff));

  // Agrupar especiais por usuário
  const porUsuario = {};
  for (const e of especiais) {
    if (!porUsuario[e.user_nome]) porUsuario[e.user_nome] = {};
    porUsuario[e.user_nome][e.chave] = e.valor;
  }
  const usuariosEsp = Object.entries(porUsuario).sort(([a], [b]) => a.localeCompare(b));

  function classePlacar(p, info) {
    if (info.res_m == null) return null;
    const dm = p.gols_m - p.gols_v, dr = info.res_m - info.res_v;
    if (p.gols_m === info.res_m && p.gols_v === info.res_v) return "pp-exato";
    if (Math.sign(dm) === Math.sign(dr) && dm === dr) return "pp-inter";
    if (Math.sign(dm) === Math.sign(dr)) return "pp-min";
    return "pp-erro";
  }

  const cores = { "pp-exato": "var(--exato)", "pp-inter": "var(--inter)", "pp-min": "var(--min)", "pp-erro": "var(--danger)" };

  return (
    <div>
      <div className="subtabs">
        <button className={"subtab"+(aba==="jogos"?" on":"")} onClick={() => setAba("jogos")}>Por jogo</button>
        <button className={"subtab"+(aba==="especiais"?" on":"")} onClick={() => setAba("especiais")}>Apostas especiais</button>
        <button className="btn btn-ghost" style={{ marginLeft:"auto", padding:"6px 12px", fontSize:12.5 }}
          onClick={() => api.get("/api/predictions/todos").then(setData)}>↻</button>
      </div>

      {aba === "jogos" && (
        <>
          <div className="note">
            <b>{placares.length}</b> palpite(s) em <b>{jogosOrdenados.length}</b> jogo(s). Palpites ficam visíveis após o jogo travar (5 min antes do apito).
          </div>
          {jogosOrdenados.length === 0 && <div className="note">Nenhum palpite registrado ainda.</div>}
          {jogosOrdenados.map(({ info, apostas }) => {
            const kd = new Date(info.kickoff);
            const dataFmt = isNaN(kd) ? "" : kd.toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" });
            const temResultado = info.res_m != null;
            // Só mostra palpites depois que o jogo travou (kickoff - 5min)
            const travado = Date.now() >= kd.getTime() - 5 * 60 * 1000;
            return (
              <div key={info.match_id} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: travado ? 10 : 0 }}>
                  <div>
                    <span className="chip" style={{ marginRight: 8 }}>{info.grupo ? `Grupo ${info.grupo}` : info.fase}</span>
                    <b>{flag(info.mandante)} {info.mandante} × {info.visitante} {flag(info.visitante)}</b>
                  </div>
                  <div style={{ fontSize: 12, color:"var(--muted)", textAlign:"right" }}>
                    {dataFmt}
                    {temResultado && <div style={{ color:"var(--chalk)", fontWeight:700 }}>{info.res_m} × {info.res_v}</div>}
                  </div>
                </div>
                {!travado ? (
                  <div style={{ fontSize: 12, color:"var(--muted)", marginTop: 6 }}>🔒 Palpites revelados após o jogo travar</div>
                ) : (
                  <div style={{ display:"flex", flexWrap:"wrap", gap: 8, marginTop: 4 }}>
                    {apostas.map((a) => {
                      const cls = classePlacar(a, info);
                      const col = cls ? cores[cls] : "var(--muted)";
                      const euSou = a.user_nome === myNome;
                      return (
                        <div key={a.user_id} style={{
                          background: euSou ? "rgba(245,184,46,.08)" : "var(--surface2)",
                          border: `1px solid ${euSou ? "rgba(245,184,46,.4)" : col+"30"}`,
                          borderRadius: 10, padding:"6px 12px", minWidth: 110
                        }}>
                          <div style={{ fontSize:14, fontWeight:700, color: col || "var(--chalk)", fontFamily:"'Oswald',sans-serif" }}>
                            {a.gols_m} × {a.gols_v}
                          </div>
                          <div style={{ fontSize:11, color: euSou ? "var(--gold)" : "var(--muted)", marginTop:2, fontWeight: euSou ? 700 : 400 }}>
                            {a.user_nome}{euSou ? " (você)" : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {aba === "especiais" && (
        <>
          <div className="note"><b>{usuariosEsp.length}</b> pessoa(s) fizeram apostas especiais.</div>
          {usuariosEsp.length === 0 && <div className="note">Nenhuma aposta especial ainda.</div>}
          {usuariosEsp.map(([nome, bets]) => {
            const euSou = nome === myNome;
            return (
              <div key={nome} className="card" style={{ marginBottom: 10, borderColor: euSou ? "rgba(245,184,46,.4)" : undefined }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: euSou ? "var(--gold)" : "var(--chalk)" }}>
                  {nome}{euSou ? " (você)" : ""}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
                  {ESPECIAIS_DEFS.map((d) => (
                    <div key={d.key} style={{ background:"var(--surface2)", borderRadius:10, padding:"8px 12px" }}>
                      <div style={{ fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:".05em" }}>{d.label}</div>
                      <div style={{ fontSize:13, fontWeight:600, marginTop:4 }}>
                        {bets[d.key] || <span style={{ color:"var(--danger)" }}>não preenchido</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

/* ── Ranking ──────────────────────────────────────────────────────────── */
function Ranking({ myId }) {
  const [data, setData] = useState(null);
  const [sub, setSub] = useState("geral");

  useEffect(() => {
    api.get("/api/leaderboard").then(setData).catch(() => {});
  }, []);

  if (!data) return <div className="note">Carregando ranking…</div>;

  const linhas = data.geral || [];
  const maxExatos = Math.max(0, ...linhas.map((l) => l.exatos));
  const craques = (data.craques || []).filter((c) => c.status !== "pendente");

  return (
    <div>
      <div className="subtabs" style={{ marginTop: 6 }}>
        <button className={"subtab"+(sub==="geral"?" on":"")} onClick={() => setSub("geral")}>Geral</button>
        <button className={"subtab"+(sub==="rodada"?" on":"")} onClick={() => setSub("rodada")}>Craque da rodada</button>
        <button className="btn btn-ghost" style={{ marginLeft: "auto", padding: "6px 12px", fontSize: 12.5 }} onClick={() => api.get("/api/leaderboard").then(setData)}>↻</button>
      </div>

      {sub === "geral" && (
        <>
          {linhas.length === 0 && <div className="note">Ninguém pontuou ainda.</div>}
          {linhas.map((l, i) => (
            <div key={l.id} className={"rank-row rank-"+(i+1)}>
              <div className="rank-pos">{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
              <div>
                <div className="rank-name">
                  {l.nome}
                  {l.nome === myId && <span className="tag tag-gold">você</span>}
                  {l.exatos > 0 && l.exatos === maxExatos && <span className="tag tag-gold">🎯 cravador</span>}
                </div>
                <div className="rank-sub">{l.exatos} exato(s) · {l.placaresPts} de jogos</div>
              </div>
              <div className="rank-pts">{l.total}<small>pontos</small></div>
            </div>
          ))}
        </>
      )}

      {sub === "rodada" && (
        <div>
          {craques.length === 0 && <div className="note">Aparece assim que a primeira rodada tiver resultados.</div>}
          {craques.map(({ key, label, status, total, feitos, linhas: cl }) => {
            const campeao = cl?.[0];
            return (
              <div className="cr-card" key={key}>
                <div className="cr-head">
                  <b>{label}</b>
                  <span className="cr-status">{status === "completa" ? "encerrada" : `${feitos}/${total} jogos`}</span>
                </div>
                {campeao ? (
                  <>
                    <div className="cr-winner">
                      <span className="cr-trophy">🏆</span>
                      <div>
                        <div className="nm">{campeao.nome}{campeao.nome === myId && <span className="tag tag-gold" style={{ marginLeft: 8 }}>você</span>}</div>
                        <div className="sub">{campeao.exatos} exato(s)</div>
                      </div>
                      <div className="pts">{campeao.pts}</div>
                    </div>
                    {cl.slice(1, 4).length > 0 && (
                      <div className="cr-rest">
                        {cl.slice(1, 4).map((l, i) => (
                          <span className="cr-chip" key={l.id}>{i+2}º <b>{l.nome}</b> · {l.pts}pts</span>
                        ))}
                      </div>
                    )}
                  </>
                ) : <div className="cr-status">Ninguém pontuou ainda.</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Regras ───────────────────────────────────────────────────────────── */
function Regras() {
  return (
    <div>
      <div className="section-h">Pontuação</div>
      <div className="rule"><div className="stars">⭐⭐⭐</div><div><b>Placar exato = máximo</b><p>Cravou exato: ex. previu 2×1, foi 2×1.</p></div></div>
      <div className="rule"><div className="stars">⭐⭐</div><div><b>Vencedor + saldo = intermediária</b><p>Acertou quem ganhou e a diferença, mas não o placar (previu 2×0, foi 3×1).</p></div></div>
      <div className="rule"><div className="stars">⭐</div><div><b>Só o vencedor = mínima</b><p>Acertou só quem venceu ou que seria empate.</p></div></div>
      <div className="note" style={{ marginTop: 16 }}>Pontos <b>crescem por fase</b>. Exato vale 10 nos grupos e chega a 50 na final. Só conta o <b>tempo regulamentar (90 min)</b>.</div>
      <div className="section-h">Tabela por fase</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "var(--muted)", textAlign: "left" }}>
              <th style={{ padding: "8px 6px" }}>Fase</th>
              <th style={{ padding: "8px 6px", color: "var(--exato)" }}>Exato</th>
              <th style={{ padding: "8px 6px", color: "var(--inter)" }}>Venc.+saldo</th>
              <th style={{ padding: "8px 6px", color: "var(--min)" }}>Só venc.</th>
            </tr>
          </thead>
          <tbody>
            {FASES.map((f) => (
              <tr key={f.key} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={{ padding: "8px 6px" }}>{f.label}</td>
                <td style={{ padding: "8px 6px" }}>{PONTOS[f.key]?.exato}</td>
                <td style={{ padding: "8px 6px" }}>{PONTOS[f.key]?.inter}</td>
                <td style={{ padding: "8px 6px" }}>{PONTOS[f.key]?.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section-h">Prazos — IMPORTANTE</div>
      <div className="rule"><div className="stars">🕓</div><div><b>Apostas especiais — prazo fixo</b><p>Campeão, Artilheiro, Líder de assistências e Craque da Copa devem ser preenchidos <b>até 11/06/2026 às 23h (Brasília)</b>. Após esse horário as apostas travam automaticamente e não contam.</p></div></div>
      <div className="rule"><div className="stars">⚽</div><div><b>Palpites de jogo — 5 minutos antes</b><p>Cada jogo fecha <b>5 minutos antes do apito inicial</b>. Tentou depois? Não passa. Sem exceções.</p></div></div>
      <div className="section-h">Apostas especiais</div>
      <div className="note">{ESPECIAIS_DEFS.map((d) => `${d.label} (+${d.pts})`).join(", ")}. São bônus por visão — o grosso dos pontos vem do jogo a jogo.</div>
    </div>
  );
}

/* ── Admin ────────────────────────────────────────────────────────────── */
function Admin({ gstate, onReload, showToast }) {
  const [secao, setSecao] = useState("resultados");

  async function toggleCopa() {
    await api.post("/api/admin/copa", { copaComecou: !gstate?.copaComecou });
    await onReload();
    showToast(gstate?.copaComecou ? "Especiais reabertas" : "Especiais travadas");
  }

  return (
    <div>
      <div className="note">🛠 <b>Admin.</b> Insira os resultados manualmente após cada jogo. Aqui você também controla a Copa, cadastra mata-mata e define vencedores das especiais.</div>
      <div className="subtabs">
        {[["resultados","Resultados"],["copa","Copa"],["mata","Mata-mata"],["oficiais","Especiais oficiais"],["palpites","Palpites"],["usuarios","Usuários"]].map(([k,l]) => (
          <button key={k} className={"subtab"+(secao===k?" on":"")} onClick={() => setSecao(k)}>{l}</button>
        ))}
      </div>

      {secao === "copa" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <b>Copa começou?</b>
              <p style={{ color: "var(--muted)", fontSize: 13, margin: "4px 0 0" }}>Ao ativar, as <b>apostas especiais travam</b>.</p>
            </div>
            <button className={"btn "+(gstate?.copaComecou?"btn-gold":"btn-primary")} onClick={toggleCopa}>
              {gstate?.copaComecou ? "Travada — reabrir" : "Travar especiais"}
            </button>
          </div>
        </div>
      )}

      {secao === "resultados" && <AdminResultados gstate={gstate} onReload={onReload} showToast={showToast} />}
      {secao === "mata" && <AdminMataMata gstate={gstate} onReload={onReload} showToast={showToast} />}
      {secao === "oficiais" && <AdminOficiais gstate={gstate} onReload={onReload} showToast={showToast} />}
      {secao === "palpites" && <AdminPalpites />}
      {secao === "usuarios" && <AdminUsuarios />}
    </div>
  );
}

function AdminResultados({ gstate, onReload, showToast }) {
  const [faseSel, setFaseSel] = useState("grupos");
  const lista = (gstate?.matches || []).filter((j) => j.fase === faseSel).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));

  async function salvarResultado(jid, m, v) {
    if (m === "" || v === "") return;
    await api.post("/api/admin/resultado", { matchId: jid, m: parseInt(m), v: parseInt(v) });
    await onReload();
    showToast("Resultado salvo ✓");
  }
  async function limparResultado(jid) {
    await api.delete(`/api/admin/resultado/${jid}`);
    await onReload();
    showToast("Resultado removido");
  }

  return (
    <div>
      <div className="subtabs">
        {FASES.map((f) => (
          <button key={f.key} className={"subtab"+(faseSel===f.key?" on":"")} onClick={() => setFaseSel(f.key)}>{f.label}</button>
        ))}
      </div>
      {lista.length === 0 && <div className="note">Nenhum jogo nesta fase.</div>}
      {lista.map((j) => (
        <AdminResultadoRow key={j.id} jogo={j} resultado={gstate?.results?.[j.id]} onSave={salvarResultado} onClear={limparResultado} />
      ))}
    </div>
  );
}

function AdminResultadoRow({ jogo, resultado, onSave, onClear }) {
  const [m, setM] = useState(resultado?.m ?? "");
  const [v, setV] = useState(resultado?.v ?? "");
  useEffect(() => { setM(resultado?.m ?? ""); setV(resultado?.v ?? ""); }, [resultado]);
  return (
    <div className="card" style={{ padding: "12px 14px" }}>
      <div className="match">
        <div className="side"><span className="fl">{flag(jogo.mandante)}</span><span className="nm">{jogo.mandante}</span></div>
        <div className="score">
          <input className="inp" style={{ width: 52, textAlign: "center", padding: 8 }} type="number" min="0" value={m} onChange={(e) => setM(e.target.value)} />
          <span className="x">×</span>
          <input className="inp" style={{ width: 52, textAlign: "center", padding: 8 }} type="number" min="0" value={v} onChange={(e) => setV(e.target.value)} />
        </div>
        <div className="side r"><span className="nm">{jogo.visitante}</span><span className="fl">{flag(jogo.visitante)}</span></div>
      </div>
      <div className="confirm-row">
        {resultado && <button className="btn btn-ghost" style={{ padding: "7px 12px" }} onClick={() => onClear(jogo.id)}>Limpar</button>}
        <button className="btn btn-primary" onClick={() => onSave(jogo.id, m, v)}>{resultado ? "Atualizar" : "Salvar"}</button>
      </div>
    </div>
  );
}

function AdminMataMata({ gstate, onReload, showToast }) {
  const [fase, setFase] = useState("16avos");
  const [mand, setMand] = useState("");
  const [vis, setVis] = useState("");
  const [kick, setKick] = useState("2026-06-29T16:00");

  async function add() {
    if (!mand || !vis || mand === vis) { showToast("Escolha duas seleções diferentes"); return; }
    const id = `ko-${fase}-${Date.now()}`;
    await api.post("/api/admin/knockout", { id, fase, mandante: mand, visitante: vis, kickoff: kick });
    await onReload();
    showToast("Jogo adicionado ✓");
    setMand(""); setVis("");
  }
  async function remover(id) {
    await api.delete(`/api/admin/knockout/${id}`);
    await onReload();
  }

  const knockouts = (gstate?.matches || []).filter((j) => j.fase !== "grupos");

  return (
    <div>
      <div className="note">Cadastre os confrontos do mata-mata conforme os grupos fecharem.</div>
      <div className="card">
        <label className="lbl">Fase</label>
        <select className="inp" value={fase} onChange={(e) => setFase(e.target.value)} style={{ marginBottom: 12 }}>
          {FASES.filter((f) => f.key !== "grupos").map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "end" }}>
          <div>
            <label className="lbl">Mandante</label>
            <select className="inp" value={mand} onChange={(e) => setMand(e.target.value)}>
              <option value="">—</option>
              {TODAS_SELECOES.map((s) => <option key={s} value={s}>{flag(s)} {s}</option>)}
            </select>
          </div>
          <span className="x" style={{ paddingBottom: 10 }}>×</span>
          <div>
            <label className="lbl">Visitante</label>
            <select className="inp" value={vis} onChange={(e) => setVis(e.target.value)}>
              <option value="">—</option>
              {TODAS_SELECOES.map((s) => <option key={s} value={s}>{flag(s)} {s}</option>)}
            </select>
          </div>
        </div>
        <label className="lbl" style={{ marginTop: 12 }}>Data e hora</label>
        <input className="inp" type="datetime-local" value={kick} onChange={(e) => setKick(e.target.value)} />
        <div style={{ textAlign: "right", marginTop: 12 }}><button className="btn btn-primary" onClick={add}>Adicionar</button></div>
      </div>
      {knockouts.length > 0 && <div className="section-h">Mata-mata cadastrado</div>}
      {knockouts.map((k) => (
        <div className="card" key={k.id} style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><span className="chip">{FASE_LABEL[k.fase]}</span>&nbsp; {flag(k.mandante)} {k.mandante} × {k.visitante} {flag(k.visitante)}</div>
          <button className="btn btn-ghost" style={{ padding: "6px 12px" }} onClick={() => remover(k.id)}>Remover</button>
        </div>
      ))}
    </div>
  );
}

function AdminPalpites() {
  const [aba, setAba] = useState("jogos");
  const [palpites, setPalpites] = useState(null);
  const [especiais, setEspeciais] = useState(null);

  useEffect(() => {
    api.get("/api/admin/palpites").then(setPalpites).catch(() => setPalpites([]));
    api.get("/api/admin/especiais-palpites").then(setEspeciais).catch(() => setEspeciais([]));
  }, []);

  if (!palpites || !especiais) return <div className="note">Carregando palpites…</div>;

  // Agrupar palpites por jogo
  const porJogo = {};
  for (const p of palpites) {
    if (!porJogo[p.match_id]) porJogo[p.match_id] = { info: p, apostas: [] };
    porJogo[p.match_id].apostas.push(p);
  }
  const jogosOrdenados = Object.values(porJogo).sort((a, b) => new Date(a.info.kickoff) - new Date(b.info.kickoff));

  // Agrupar especiais por usuário
  const porUsuario = {};
  for (const e of especiais) {
    if (!porUsuario[e.user_nome]) porUsuario[e.user_nome] = {};
    porUsuario[e.user_nome][e.chave] = e.valor;
  }
  const usuariosEsp = Object.entries(porUsuario).sort(([a], [b]) => a.localeCompare(b));

  function classePlacar(p, info) {
    if (info.res_m == null) return null;
    const dm = p.gols_m - p.gols_v, dr = info.res_m - info.res_v;
    if (p.gols_m === info.res_m && p.gols_v === info.res_v) return "pp-exato";
    if (Math.sign(dm) === Math.sign(dr) && dm === dr) return "pp-inter";
    if (Math.sign(dm) === Math.sign(dr)) return "pp-min";
    return "pp-erro";
  }

  return (
    <div>
      <div className="subtabs">
        <button className={"subtab"+(aba==="jogos"?" on":"")} onClick={() => setAba("jogos")}>Por jogo</button>
        <button className={"subtab"+(aba==="especiais"?" on":"")} onClick={() => setAba("especiais")}>Apostas especiais</button>
      </div>

      {aba === "jogos" && (
        <>
          <div className="note">
            <b>{palpites.length}</b> palpite(s) registrado(s) em <b>{jogosOrdenados.length}</b> jogo(s).
            Cores: <span style={{color:"var(--exato)"}}>■ exato</span> · <span style={{color:"var(--inter)"}}>■ venc+saldo</span> · <span style={{color:"var(--min)"}}>■ só venc.</span> · <span style={{color:"var(--danger)"}}>■ errou</span>
          </div>
          {jogosOrdenados.length === 0 && <div className="note">Nenhum palpite ainda.</div>}
          {jogosOrdenados.map(({ info, apostas }) => {
            const kd = new Date(info.kickoff);
            const dataFmt = isNaN(kd) ? "" : kd.toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" });
            const temResultado = info.res_m != null;
            return (
              <div key={info.match_id} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 10 }}>
                  <div>
                    <span className="chip" style={{ marginRight: 8 }}>{info.grupo ? `Grupo ${info.grupo}` : info.fase}</span>
                    <b>{flag(info.mandante)} {info.mandante} × {info.visitante} {flag(info.visitante)}</b>
                  </div>
                  <div style={{ fontSize: 12, color:"var(--muted)", textAlign:"right" }}>
                    {dataFmt}
                    {temResultado && <div style={{color:"var(--chalk)", fontWeight:700}}>{info.res_m} × {info.res_v}</div>}
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap: 8 }}>
                  {apostas.map((a) => {
                    const cls = classePlacar(a, info);
                    const colors = { "pp-exato":"var(--exato)", "pp-inter":"var(--inter)", "pp-min":"var(--min)", "pp-erro":"var(--danger)" };
                    const col = cls ? colors[cls] : "var(--muted)";
                    return (
                      <div key={a.user_id} style={{ background:"var(--surface2)", border:`1px solid ${col}30`, borderRadius:10, padding:"6px 12px", minWidth:120 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:col }}>{a.gols_m} × {a.gols_v}</div>
                        <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{a.user_nome}</div>
                        <div style={{ fontSize:10, color:"var(--muted)" }}>{new Date(a.updated_at * 1000).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {aba === "especiais" && (
        <>
          <div className="note"><b>{usuariosEsp.length}</b> usuário(s) fizeram apostas especiais.</div>
          {usuariosEsp.length === 0 && <div className="note">Nenhuma aposta especial ainda.</div>}
          {usuariosEsp.map(([nome, bets]) => (
            <div key={nome} className="card" style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{nome}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {ESPECIAIS_DEFS.map((d) => (
                  <div key={d.key} style={{ background:"var(--surface2)", borderRadius:10, padding:"8px 12px" }}>
                    <div style={{ fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:".05em" }}>{d.label}</div>
                    <div style={{ fontSize:13, fontWeight:600, marginTop:4 }}>{bets[d.key] || <span style={{color:"var(--danger)"}}>não preenchido</span>}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function AdminUsuarios() {
  const [users, setUsers] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const u = await api.get("/api/admin/users").catch(() => []);
    setUsers(u);
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(u) {
    if (!window.confirm(`Excluir ${u.nome} (${u.email})? Os palpites dele também serão removidos.`)) return;
    setBusy(true);
    await api.delete(`/api/admin/users/${u.id}`).catch((e) => alert(e.message));
    await load();
    setBusy(false);
  }

  async function handleToggleAdmin(u) {
    if (!window.confirm(`${u.isAdmin ? "Remover admin de" : "Tornar admin"} ${u.nome}?`)) return;
    setBusy(true);
    await api.put(`/api/admin/users/${u.id}`, { isAdmin: !u.isAdmin }).catch((e) => alert(e.message));
    await load();
    setBusy(false);
  }

  function startEdit(u) {
    setEditId(u.id);
    setEditNome(u.nome);
    setEditEmail(u.email);
  }

  async function handleSaveEdit(u) {
    if (!editNome.trim() || !editEmail.trim()) { alert("Nome e e-mail não podem ser vazios."); return; }
    setBusy(true);
    await api.put(`/api/admin/users/${u.id}`, { nome: editNome.trim(), email: editEmail.trim() }).catch((e) => alert(e.message));
    setEditId(null);
    await load();
    setBusy(false);
  }

  if (!users) return <div className="note">Carregando…</div>;

  return (
    <div>
      <div className="note"><b>{users.length}</b> usuário(s) cadastrado(s). <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={load}>↻ atualizar</button></div>
      {users.map((u) => (
        <div key={u.id} className="card" style={{ padding: "12px 14px", marginBottom: 10 }}>
          {editId === u.id ? (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label className="lbl">Nome</label>
                  <input className="inp" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                </div>
                <div>
                  <label className="lbl">E-mail</label>
                  <input className="inp" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setEditId(null)}>Cancelar</button>
                <button className="btn btn-primary" disabled={busy} onClick={() => handleSaveEdit(u)}>Salvar</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 14, color: "var(--muted)", minWidth: 32 }}>#{u.id}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  {u.nome}
                  {u.isAdmin && <span className="badge-admin">admin</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  {u.email} · {u.criadoEm ? new Date(u.criadoEm * 1000).toLocaleDateString("pt-BR") : "—"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} disabled={busy} onClick={() => startEdit(u)} title="Editar">✏️</button>
                <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} disabled={busy} onClick={() => handleToggleAdmin(u)} title={u.isAdmin ? "Remover admin" : "Tornar admin"}>
                  {u.isAdmin ? "👑 remover" : "👑 admin"}
                </button>
                <button className="btn" style={{ padding: "5px 10px", fontSize: 12, background: "rgba(229,72,77,.15)", borderColor: "var(--danger)", color: "var(--danger)" }} disabled={busy} onClick={() => handleDelete(u)} title="Excluir">🗑</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminOficiais({ gstate, onReload, showToast }) {
  const [of, setOf] = useState(gstate?.especiaisOficiais || {});
  useEffect(() => setOf(gstate?.especiaisOficiais || {}), [gstate?.especiaisOficiais]);
  const set = (k, v) => setOf((p) => ({ ...p, [k]: v }));

  async function salvar() {
    await api.post("/api/admin/especiais-oficiais", { especiais: of });
    await onReload();
    showToast("Vencedores oficiais salvos ✓");
  }

  return (
    <div>
      <div className="note">Defina os vencedores ao fim da Copa. Os pontos das especiais caem no ranking automaticamente.</div>
      <div className="esp-grid">
        {ESPECIAIS_DEFS.map((d) => (
          <div className="esp-card" key={d.key}>
            <div className="head"><h4>{d.label}</h4><span className="esp-pts">+{d.pts} pts</span></div>
            {d.tipo === "selecao" ? (
              <select className="inp" value={of[d.key] || ""} onChange={(e) => set(d.key, e.target.value)}>
                <option value="">— a definir —</option>
                {TODAS_SELECOES.map((s) => <option key={s} value={s}>{flag(s)} {s}</option>)}
              </select>
            ) : (
              <SelectJogador tipo={d.tipo} value={of[d.key] || ""} onChange={(v) => set(d.key, v)} />
            )}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <button className="btn btn-gold" onClick={salvar}>Salvar e pontuar</button>
      </div>
    </div>
  );
}

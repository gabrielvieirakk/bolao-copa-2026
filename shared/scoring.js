export const PONTOS = {
  grupos:   { exato: 3, inter: 2, min: 1 },
  "16avos": { exato: 3, inter: 2, min: 1 },
  oitavas:  { exato: 3, inter: 2, min: 1 },
  quartas:  { exato: 3, inter: 2, min: 1 },
  semi:     { exato: 3, inter: 2, min: 1 },
  terceiro: { exato: 3, inter: 2, min: 1 },
  final:    { exato: 3, inter: 2, min: 1 },
};

export const norm = (s) =>
  String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

export function pontuarJogo(palpite, resultado, pts) {
  if (!palpite || !resultado) return 0;
  const { m: pm, v: pv } = palpite;
  const { m: rm, v: rv } = resultado;
  if ([pm, pv, rm, rv].some((x) => x === "" || x === null || x === undefined)) return 0;
  if (+pm === +rm && +pv === +rv) return pts.exato;
  const rOut = Math.sign(+rm - +rv);
  const pOut = Math.sign(+pm - +pv);
  if (rOut !== pOut) return 0;
  if (rOut === 0) return pts.min;
  if (+rm - +rv === +pm - +pv) return pts.inter;
  return pts.min;
}

export function classePontuacao(palpite, resultado) {
  if (!palpite || !resultado) return null;
  const { m: pm, v: pv } = palpite;
  const { m: rm, v: rv } = resultado;
  if (+pm === +rm && +pv === +rv) return "exato";
  const rOut = Math.sign(+rm - +rv), pOut = Math.sign(+pm - +pv);
  if (rOut !== pOut) return "erro";
  if (rOut === 0) return "min";
  if (+rm - +rv === +pm - +pv) return "inter";
  return "min";
}

export const PONTOS = {
  grupos:   { exato: 10, inter: 6,  min: 3  },
  "16avos": { exato: 14, inter: 8,  min: 4  },
  oitavas:  { exato: 18, inter: 11, min: 5  },
  quartas:  { exato: 24, inter: 14, min: 7  },
  semi:     { exato: 32, inter: 18, min: 9  },
  terceiro: { exato: 38, inter: 22, min: 11 },
  final:    { exato: 50, inter: 30, min: 15 },
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

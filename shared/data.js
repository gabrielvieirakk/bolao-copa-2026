export const GRUPOS = {
  A: ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
  B: ["Canadá", "Catar", "Suíça", "Bósnia e Herzegovina"],
  C: ["Brasil", "Marrocos", "Haiti", "Escócia"],
  D: ["Estados Unidos", "Paraguai", "Austrália", "Turquia"],
  E: ["Alemanha", "Curaçao", "Costa do Marfim", "Equador"],
  F: ["Holanda", "Japão", "Tunísia", "Suécia"],
  G: ["Bélgica", "Egito", "Irã", "Nova Zelândia"],
  H: ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"],
  I: ["França", "Senegal", "Noruega", "Iraque"],
  J: ["Argentina", "Argélia", "Áustria", "Jordânia"],
  K: ["Portugal", "Uzbequistão", "Colômbia", "RD Congo"],
  L: ["Inglaterra", "Croácia", "Gana", "Panamá"],
};

export const FLAGS = {
  "México": "🇲🇽", "África do Sul": "🇿🇦", "Coreia do Sul": "🇰🇷", "República Tcheca": "🇨🇿",
  "Canadá": "🇨🇦", "Catar": "🇶🇦", "Suíça": "🇨🇭", "Bósnia e Herzegovina": "🇧🇦",
  "Brasil": "🇧🇷", "Marrocos": "🇲🇦", "Haiti": "🇭🇹", "Escócia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Estados Unidos": "🇺🇸", "Paraguai": "🇵🇾", "Austrália": "🇦🇺", "Turquia": "🇹🇷",
  "Alemanha": "🇩🇪", "Curaçao": "🇨🇼", "Costa do Marfim": "🇨🇮", "Equador": "🇪🇨",
  "Holanda": "🇳🇱", "Japão": "🇯🇵", "Tunísia": "🇹🇳", "Suécia": "🇸🇪",
  "Bélgica": "🇧🇪", "Egito": "🇪🇬", "Irã": "🇮🇷", "Nova Zelândia": "🇳🇿",
  "Espanha": "🇪🇸", "Cabo Verde": "🇨🇻", "Arábia Saudita": "🇸🇦", "Uruguai": "🇺🇾",
  "França": "🇫🇷", "Senegal": "🇸🇳", "Noruega": "🇳🇴", "Iraque": "🇮🇶",
  "Argentina": "🇦🇷", "Argélia": "🇩🇿", "Áustria": "🇦🇹", "Jordânia": "🇯🇴",
  "Portugal": "🇵🇹", "Uzbequistão": "🇺🇿", "Colômbia": "🇨🇴", "RD Congo": "🇨🇩",
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croácia": "🇭🇷", "Gana": "🇬🇭", "Panamá": "🇵🇦",
};

export const TODAS_SELECOES = Array.from(new Set(Object.values(GRUPOS).flat())).sort((a, b) =>
  a.localeCompare(b, "pt-BR")
);

export const FASES = [
  { key: "grupos", label: "Fase de Grupos" },
  { key: "16avos", label: "16-avos" },
  { key: "oitavas", label: "Oitavas" },
  { key: "quartas", label: "Quartas" },
  { key: "semi", label: "Semi" },
  { key: "terceiro", label: "3º Lugar" },
  { key: "final", label: "Final" },
];
export const FASE_LABEL = Object.fromEntries(FASES.map((f) => [f.key, f.label]));

export const RODADAS = [
  { key: "g1", label: "Grupos · Rodada 1", fn: (j) => j.fase === "grupos" && j.rodada === 1 },
  { key: "g2", label: "Grupos · Rodada 2", fn: (j) => j.fase === "grupos" && j.rodada === 2 },
  { key: "g3", label: "Grupos · Rodada 3", fn: (j) => j.fase === "grupos" && j.rodada === 3 },
  { key: "16avos", label: "16-avos", fn: (j) => j.fase === "16avos" },
  { key: "oitavas", label: "Oitavas", fn: (j) => j.fase === "oitavas" },
  { key: "quartas", label: "Quartas", fn: (j) => j.fase === "quartas" },
  { key: "semi", label: "Semifinais", fn: (j) => j.fase === "semi" },
  { key: "terceiro", label: "Disputa de 3º", fn: (j) => j.fase === "terceiro" },
  { key: "final", label: "Final", fn: (j) => j.fase === "final" },
];

export const ESPECIAIS_DEFS = [
  { key: "campeao", label: "Campeão", tipo: "selecao", pts: 25 },
  { key: "vice", label: "Vice-campeão", tipo: "selecao", pts: 15 },
  { key: "terceiro", label: "3º lugar", tipo: "selecao", pts: 10 },
  { key: "artilheiro", label: "Artilheiro", tipo: "jogador", pts: 15 },
  { key: "assistente", label: "Líder de assistências", tipo: "jogador", pts: 10 },
  { key: "goleiro", label: "Goleiro menos vazado", tipo: "goleiro", pts: 10 },
];

export const JOGADORES = [
  { n: "Kylian Mbappé", s: "França" }, { n: "Ousmane Dembélé", s: "França" }, { n: "Michael Olise", s: "França" }, { n: "Marcus Thuram", s: "França" }, { n: "Bradley Barcola", s: "França" }, { n: "Antoine Griezmann", s: "França" },
  { n: "Vinícius Júnior", s: "Brasil" }, { n: "Raphinha", s: "Brasil" }, { n: "Rodrygo", s: "Brasil" }, { n: "Estêvão", s: "Brasil" }, { n: "Matheus Cunha", s: "Brasil" }, { n: "João Pedro", s: "Brasil" }, { n: "Neymar", s: "Brasil" },
  { n: "Harry Kane", s: "Inglaterra" }, { n: "Jude Bellingham", s: "Inglaterra" }, { n: "Bukayo Saka", s: "Inglaterra" }, { n: "Phil Foden", s: "Inglaterra" }, { n: "Cole Palmer", s: "Inglaterra" }, { n: "Marcus Rashford", s: "Inglaterra" },
  { n: "Lamine Yamal", s: "Espanha" }, { n: "Nico Williams", s: "Espanha" }, { n: "Dani Olmo", s: "Espanha" }, { n: "Pedri", s: "Espanha" }, { n: "Ferran Torres", s: "Espanha" }, { n: "Mikel Oyarzabal", s: "Espanha" },
  { n: "Lionel Messi", s: "Argentina" }, { n: "Julián Álvarez", s: "Argentina" }, { n: "Lautaro Martínez", s: "Argentina" }, { n: "Thiago Almada", s: "Argentina" }, { n: "Giuliano Simeone", s: "Argentina" },
  { n: "Jamal Musiala", s: "Alemanha" }, { n: "Florian Wirtz", s: "Alemanha" }, { n: "Kai Havertz", s: "Alemanha" }, { n: "Serge Gnabry", s: "Alemanha" }, { n: "Niclas Füllkrug", s: "Alemanha" },
  { n: "Cristiano Ronaldo", s: "Portugal" }, { n: "Bruno Fernandes", s: "Portugal" }, { n: "Rafael Leão", s: "Portugal" }, { n: "Pedro Neto", s: "Portugal" }, { n: "Gonçalo Ramos", s: "Portugal" }, { n: "João Félix", s: "Portugal" },
  { n: "Memphis Depay", s: "Holanda" }, { n: "Cody Gakpo", s: "Holanda" }, { n: "Xavi Simons", s: "Holanda" }, { n: "Tijjani Reijnders", s: "Holanda" }, { n: "Donyell Malen", s: "Holanda" },
  { n: "Kevin De Bruyne", s: "Bélgica" }, { n: "Romelu Lukaku", s: "Bélgica" }, { n: "Jérémy Doku", s: "Bélgica" }, { n: "Leandro Trossard", s: "Bélgica" }, { n: "Loïs Openda", s: "Bélgica" },
  { n: "Erling Haaland", s: "Noruega" }, { n: "Alexander Sørloth", s: "Noruega" }, { n: "Martin Ødegaard", s: "Noruega" }, { n: "Antonio Nusa", s: "Noruega" },
  { n: "Darwin Núñez", s: "Uruguai" }, { n: "Federico Valverde", s: "Uruguai" }, { n: "Facundo Pellistri", s: "Uruguai" }, { n: "Maximiliano Araújo", s: "Uruguai" },
  { n: "Luka Modrić", s: "Croácia" }, { n: "Andrej Kramarić", s: "Croácia" }, { n: "Ante Budimir", s: "Croácia" }, { n: "Martin Baturina", s: "Croácia" },
  { n: "Achraf Hakimi", s: "Marrocos" }, { n: "Youssef En-Nesyri", s: "Marrocos" }, { n: "Brahim Díaz", s: "Marrocos" }, { n: "Hakim Ziyech", s: "Marrocos" },
  { n: "Mohamed Salah", s: "Egito" }, { n: "Omar Marmoush", s: "Egito" }, { n: "Trezeguet", s: "Egito" },
  { n: "Sadio Mané", s: "Senegal" }, { n: "Nicolas Jackson", s: "Senegal" }, { n: "Iliman Ndiaye", s: "Senegal" }, { n: "Habib Diallo", s: "Senegal" },
  { n: "Luis Díaz", s: "Colômbia" }, { n: "James Rodríguez", s: "Colômbia" }, { n: "Jhon Durán", s: "Colômbia" }, { n: "Jhon Córdoba", s: "Colômbia" },
  { n: "Takefusa Kubo", s: "Japão" }, { n: "Kaoru Mitoma", s: "Japão" }, { n: "Ayase Ueda", s: "Japão" }, { n: "Daichi Kamada", s: "Japão" },
  { n: "Son Heung-min", s: "Coreia do Sul" }, { n: "Lee Kang-in", s: "Coreia do Sul" }, { n: "Hwang Hee-chan", s: "Coreia do Sul" }, { n: "Oh Hyeon-gyu", s: "Coreia do Sul" },
  { n: "Viktor Gyökeres", s: "Suécia" }, { n: "Alexander Isak", s: "Suécia" }, { n: "Anthony Elanga", s: "Suécia" }, { n: "Dejan Kulusevski", s: "Suécia" },
  { n: "Christian Pulisic", s: "Estados Unidos" }, { n: "Folarin Balogun", s: "Estados Unidos" }, { n: "Timothy Weah", s: "Estados Unidos" }, { n: "Ricardo Pepi", s: "Estados Unidos" },
  { n: "Raúl Jiménez", s: "México" }, { n: "Santiago Giménez", s: "México" }, { n: "Hirving Lozano", s: "México" }, { n: "Alexis Vega", s: "México" },
  { n: "Enner Valencia", s: "Equador" }, { n: "Kendry Páez", s: "Equador" }, { n: "Leonardo Campana", s: "Equador" },
  { n: "Sébastien Haller", s: "Costa do Marfim" }, { n: "Nicolas Pépé", s: "Costa do Marfim" }, { n: "Simon Adingra", s: "Costa do Marfim" }, { n: "Amad Diallo", s: "Costa do Marfim" },
  { n: "Breel Embolo", s: "Suíça" }, { n: "Dan Ndoye", s: "Suíça" }, { n: "Ruben Vargas", s: "Suíça" }, { n: "Zeki Amdouni", s: "Suíça" },
  { n: "Marko Arnautović", s: "Áustria" }, { n: "Christoph Baumgartner", s: "Áustria" }, { n: "Michael Gregoritsch", s: "Áustria" },
  { n: "Mohammed Kudus", s: "Gana" }, { n: "Iñaki Williams", s: "Gana" }, { n: "Antoine Semenyo", s: "Gana" }, { n: "Jordan Ayew", s: "Gana" },
  { n: "Mehdi Taremi", s: "Irã" }, { n: "Sardar Azmoun", s: "Irã" },
  { n: "Chris Wood", s: "Nova Zelândia" },
  { n: "Mitchell Duke", s: "Austrália" }, { n: "Jackson Irvine", s: "Austrália" },
  { n: "Almoez Ali", s: "Catar" }, { n: "Akram Afif", s: "Catar" },
  { n: "Firas Al-Buraikan", s: "Arábia Saudita" }, { n: "Salem Al-Dawsari", s: "Arábia Saudita" },
  { n: "Youssef Msakni", s: "Tunísia" }, { n: "Hannibal Mejbri", s: "Tunísia" },
  { n: "Cédric Bakambu", s: "RD Congo" }, { n: "Yoane Wissa", s: "RD Congo" }, { n: "Silas Katompa", s: "RD Congo" },
  { n: "José Fajardo", s: "Panamá" }, { n: "Adalberto Carrasquilla", s: "Panamá" }, { n: "Ismael Díaz", s: "Panamá" },
  { n: "Frantzdy Pierrot", s: "Haiti" }, { n: "Duckens Nazon", s: "Haiti" },
  { n: "Scott McTominay", s: "Escócia" }, { n: "Che Adams", s: "Escócia" }, { n: "John McGinn", s: "Escócia" }, { n: "Lyndon Dykes", s: "Escócia" },
  { n: "Miguel Almirón", s: "Paraguai" }, { n: "Antonio Sanabria", s: "Paraguai" }, { n: "Julio Enciso", s: "Paraguai" }, { n: "Diego Gómez", s: "Paraguai" },
  { n: "Riyad Mahrez", s: "Argélia" }, { n: "Mohamed Amoura", s: "Argélia" }, { n: "Baghdad Bounedjah", s: "Argélia" },
  { n: "Musa Al-Taamari", s: "Jordânia" }, { n: "Yazan Al-Naimat", s: "Jordânia" },
  { n: "Edin Džeko", s: "Bósnia e Herzegovina" }, { n: "Ermedin Demirović", s: "Bósnia e Herzegovina" },
  { n: "Aymen Hussein", s: "Iraque" }, { n: "Ali Al-Hamadi", s: "Iraque" },
  { n: "Eldor Shomurodov", s: "Uzbequistão" },
  { n: "Ryan Mendes", s: "Cabo Verde" }, { n: "Bebé", s: "Cabo Verde" }, { n: "Garry Rodrigues", s: "Cabo Verde" },
  { n: "Tahith Chong", s: "Curaçao" }, { n: "Juninho Bacuna", s: "Curaçao" },
  { n: "Lyle Foster", s: "África do Sul" }, { n: "Percy Tau", s: "África do Sul" }, { n: "Themba Zwane", s: "África do Sul" },
  { n: "Arda Güler", s: "Turquia" }, { n: "Kenan Yıldız", s: "Turquia" }, { n: "Hakan Çalhanoğlu", s: "Turquia" },
  { n: "Patrik Schick", s: "República Tcheca" }, { n: "Adam Hložek", s: "República Tcheca" },
  { n: "Jonathan David", s: "Canadá" }, { n: "Alphonso Davies", s: "Canadá" }, { n: "Cyle Larin", s: "Canadá" },
];

export const GOLEIROS = [
  { n: "Alisson", s: "Brasil" }, { n: "Emiliano Martínez", s: "Argentina" }, { n: "Mike Maignan", s: "França" },
  { n: "Unai Simón", s: "Espanha" }, { n: "Jordan Pickford", s: "Inglaterra" }, { n: "Marc-André ter Stegen", s: "Alemanha" },
  { n: "Diogo Costa", s: "Portugal" }, { n: "Bart Verbruggen", s: "Holanda" }, { n: "Thibaut Courtois", s: "Bélgica" },
  { n: "Dominik Livaković", s: "Croácia" }, { n: "Sergio Rochet", s: "Uruguai" }, { n: "Yassine Bounou", s: "Marrocos" },
  { n: "Mohamed El-Shenawy", s: "Egito" }, { n: "Édouard Mendy", s: "Senegal" }, { n: "David Ospina", s: "Colômbia" },
  { n: "Luis Malagón", s: "México" }, { n: "Matt Turner", s: "Estados Unidos" }, { n: "Yann Sommer", s: "Suíça" },
  { n: "Zion Suzuki", s: "Japão" }, { n: "Kim Seung-gyu", s: "Coreia do Sul" }, { n: "Ørjan Nyland", s: "Noruega" },
  { n: "Robin Olsen", s: "Suécia" }, { n: "Patrick Pentz", s: "Áustria" }, { n: "Maxime Crépeau", s: "Canadá" },
  { n: "Lawrence Ati-Zigi", s: "Gana" }, { n: "Hernán Galíndez", s: "Equador" }, { n: "Angus Gunn", s: "Escócia" },
];

export function gerarJogosGrupos() {
  const pares = [[0, 3], [1, 2], [0, 2], [3, 1], [0, 1], [2, 3]];
  const jogos = [];
  Object.entries(GRUPOS).forEach(([L, times], gi) => {
    pares.forEach(([a, b], i) => {
      const round = Math.floor(i / 2);
      const baseDay = [12, 18, 24][round];
      const day = Math.min(baseDay + (gi % 4), 27);
      const hour = [13, 16, 19, 22][i % 4];
      const kickoff = `2026-06-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:00:00`;
      jogos.push({
        id: `g-${L}-${i}`,
        fase: "grupos",
        grupo: L,
        rodada: round + 1,
        mandante: times[a],
        visitante: times[b],
        kickoff,
      });
    });
  });
  return jogos;
}

export const JOGOS_GRUPOS = gerarJogosGrupos();

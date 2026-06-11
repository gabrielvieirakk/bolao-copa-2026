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

// 11/06/2026 às 23:00 BRT = 12/06/2026 às 02:00 UTC
export const ESPECIAIS_DEADLINE = "2026-06-12T02:00:00.000Z";

export const ESPECIAIS_DEFS = [
  { key: "campeao",    label: "Campeão",              tipo: "selecao", pts: 25 },
  { key: "artilheiro", label: "Artilheiro",            tipo: "jogador", pts: 15 },
  { key: "assistente", label: "Líder de assistências", tipo: "jogador", pts: 10 },
  { key: "craque",     label: "Craque da Copa",        tipo: "jogador", pts: 15 },
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

// Calendário oficial FIFA Copa do Mundo 2026 — horários em UTC (EDT = UTC-4)
export const JOGOS_GRUPOS = [
  // GRUPO A
  { id:"g-A-0", fase:"grupos", grupo:"A", rodada:1, mandante:"México",            visitante:"África do Sul",       kickoff:"2026-06-11T19:00:00Z" },
  { id:"g-A-1", fase:"grupos", grupo:"A", rodada:1, mandante:"Coreia do Sul",      visitante:"República Tcheca",    kickoff:"2026-06-12T02:00:00Z" },
  { id:"g-A-2", fase:"grupos", grupo:"A", rodada:2, mandante:"República Tcheca",   visitante:"África do Sul",       kickoff:"2026-06-18T16:00:00Z" },
  { id:"g-A-3", fase:"grupos", grupo:"A", rodada:2, mandante:"México",             visitante:"Coreia do Sul",       kickoff:"2026-06-19T01:00:00Z" },
  { id:"g-A-4", fase:"grupos", grupo:"A", rodada:3, mandante:"República Tcheca",   visitante:"México",              kickoff:"2026-06-25T01:00:00Z" },
  { id:"g-A-5", fase:"grupos", grupo:"A", rodada:3, mandante:"África do Sul",      visitante:"Coreia do Sul",       kickoff:"2026-06-25T01:00:00Z" },
  // GRUPO B
  { id:"g-B-0", fase:"grupos", grupo:"B", rodada:1, mandante:"Canadá",             visitante:"Bósnia e Herzegovina",kickoff:"2026-06-12T19:00:00Z" },
  { id:"g-B-1", fase:"grupos", grupo:"B", rodada:1, mandante:"Catar",              visitante:"Suíça",               kickoff:"2026-06-13T19:00:00Z" },
  { id:"g-B-2", fase:"grupos", grupo:"B", rodada:2, mandante:"Suíça",              visitante:"Bósnia e Herzegovina",kickoff:"2026-06-18T19:00:00Z" },
  { id:"g-B-3", fase:"grupos", grupo:"B", rodada:2, mandante:"Canadá",             visitante:"Catar",               kickoff:"2026-06-18T22:00:00Z" },
  { id:"g-B-4", fase:"grupos", grupo:"B", rodada:3, mandante:"Suíça",              visitante:"Canadá",              kickoff:"2026-06-24T19:00:00Z" },
  { id:"g-B-5", fase:"grupos", grupo:"B", rodada:3, mandante:"Bósnia e Herzegovina",visitante:"Catar",             kickoff:"2026-06-24T19:00:00Z" },
  // GRUPO C
  { id:"g-C-0", fase:"grupos", grupo:"C", rodada:1, mandante:"Brasil",             visitante:"Marrocos",            kickoff:"2026-06-13T22:00:00Z" },
  { id:"g-C-1", fase:"grupos", grupo:"C", rodada:1, mandante:"Haiti",              visitante:"Escócia",             kickoff:"2026-06-14T01:00:00Z" },
  { id:"g-C-2", fase:"grupos", grupo:"C", rodada:2, mandante:"Escócia",            visitante:"Marrocos",            kickoff:"2026-06-19T22:00:00Z" },
  { id:"g-C-3", fase:"grupos", grupo:"C", rodada:2, mandante:"Brasil",             visitante:"Haiti",               kickoff:"2026-06-20T00:30:00Z" },
  { id:"g-C-4", fase:"grupos", grupo:"C", rodada:3, mandante:"Escócia",            visitante:"Brasil",              kickoff:"2026-06-24T22:00:00Z" },
  { id:"g-C-5", fase:"grupos", grupo:"C", rodada:3, mandante:"Marrocos",           visitante:"Haiti",               kickoff:"2026-06-24T22:00:00Z" },
  // GRUPO D
  { id:"g-D-0", fase:"grupos", grupo:"D", rodada:1, mandante:"Estados Unidos",     visitante:"Paraguai",            kickoff:"2026-06-13T01:00:00Z" },
  { id:"g-D-1", fase:"grupos", grupo:"D", rodada:1, mandante:"Austrália",          visitante:"Turquia",             kickoff:"2026-06-14T01:00:00Z" },
  { id:"g-D-2", fase:"grupos", grupo:"D", rodada:2, mandante:"Estados Unidos",     visitante:"Austrália",           kickoff:"2026-06-19T19:00:00Z" },
  { id:"g-D-3", fase:"grupos", grupo:"D", rodada:2, mandante:"Turquia",            visitante:"Paraguai",            kickoff:"2026-06-20T03:00:00Z" },
  { id:"g-D-4", fase:"grupos", grupo:"D", rodada:3, mandante:"Turquia",            visitante:"Estados Unidos",      kickoff:"2026-06-26T02:00:00Z" },
  { id:"g-D-5", fase:"grupos", grupo:"D", rodada:3, mandante:"Paraguai",           visitante:"Austrália",           kickoff:"2026-06-26T02:00:00Z" },
  // GRUPO E
  { id:"g-E-0", fase:"grupos", grupo:"E", rodada:1, mandante:"Alemanha",           visitante:"Curaçao",             kickoff:"2026-06-14T17:00:00Z" },
  { id:"g-E-1", fase:"grupos", grupo:"E", rodada:1, mandante:"Costa do Marfim",    visitante:"Equador",             kickoff:"2026-06-14T23:00:00Z" },
  { id:"g-E-2", fase:"grupos", grupo:"E", rodada:2, mandante:"Alemanha",           visitante:"Costa do Marfim",     kickoff:"2026-06-20T20:00:00Z" },
  { id:"g-E-3", fase:"grupos", grupo:"E", rodada:2, mandante:"Equador",            visitante:"Curaçao",             kickoff:"2026-06-21T00:00:00Z" },
  { id:"g-E-4", fase:"grupos", grupo:"E", rodada:3, mandante:"Equador",            visitante:"Alemanha",            kickoff:"2026-06-25T20:00:00Z" },
  { id:"g-E-5", fase:"grupos", grupo:"E", rodada:3, mandante:"Curaçao",            visitante:"Costa do Marfim",     kickoff:"2026-06-25T20:00:00Z" },
  // GRUPO F
  { id:"g-F-0", fase:"grupos", grupo:"F", rodada:1, mandante:"Holanda",            visitante:"Japão",               kickoff:"2026-06-14T20:00:00Z" },
  { id:"g-F-1", fase:"grupos", grupo:"F", rodada:1, mandante:"Suécia",             visitante:"Tunísia",             kickoff:"2026-06-15T02:00:00Z" },
  { id:"g-F-2", fase:"grupos", grupo:"F", rodada:2, mandante:"Holanda",            visitante:"Suécia",              kickoff:"2026-06-20T17:00:00Z" },
  { id:"g-F-3", fase:"grupos", grupo:"F", rodada:2, mandante:"Tunísia",            visitante:"Japão",               kickoff:"2026-06-21T04:00:00Z" },
  { id:"g-F-4", fase:"grupos", grupo:"F", rodada:3, mandante:"Japão",              visitante:"Suécia",              kickoff:"2026-06-25T23:00:00Z" },
  { id:"g-F-5", fase:"grupos", grupo:"F", rodada:3, mandante:"Tunísia",            visitante:"Holanda",             kickoff:"2026-06-25T23:00:00Z" },
  // GRUPO G
  { id:"g-G-0", fase:"grupos", grupo:"G", rodada:1, mandante:"Bélgica",            visitante:"Egito",               kickoff:"2026-06-15T19:00:00Z" },
  { id:"g-G-1", fase:"grupos", grupo:"G", rodada:1, mandante:"Irã",                visitante:"Nova Zelândia",       kickoff:"2026-06-16T01:00:00Z" },
  { id:"g-G-2", fase:"grupos", grupo:"G", rodada:2, mandante:"Bélgica",            visitante:"Irã",                 kickoff:"2026-06-21T19:00:00Z" },
  { id:"g-G-3", fase:"grupos", grupo:"G", rodada:2, mandante:"Nova Zelândia",      visitante:"Egito",               kickoff:"2026-06-22T01:00:00Z" },
  { id:"g-G-4", fase:"grupos", grupo:"G", rodada:3, mandante:"Egito",              visitante:"Irã",                 kickoff:"2026-06-27T03:00:00Z" },
  { id:"g-G-5", fase:"grupos", grupo:"G", rodada:3, mandante:"Nova Zelândia",      visitante:"Bélgica",             kickoff:"2026-06-27T03:00:00Z" },
  // GRUPO H
  { id:"g-H-0", fase:"grupos", grupo:"H", rodada:1, mandante:"Espanha",            visitante:"Cabo Verde",          kickoff:"2026-06-15T16:00:00Z" },
  { id:"g-H-1", fase:"grupos", grupo:"H", rodada:1, mandante:"Arábia Saudita",     visitante:"Uruguai",             kickoff:"2026-06-15T22:00:00Z" },
  { id:"g-H-2", fase:"grupos", grupo:"H", rodada:2, mandante:"Espanha",            visitante:"Arábia Saudita",      kickoff:"2026-06-21T16:00:00Z" },
  { id:"g-H-3", fase:"grupos", grupo:"H", rodada:2, mandante:"Uruguai",            visitante:"Cabo Verde",          kickoff:"2026-06-21T22:00:00Z" },
  { id:"g-H-4", fase:"grupos", grupo:"H", rodada:3, mandante:"Cabo Verde",         visitante:"Arábia Saudita",      kickoff:"2026-06-27T00:00:00Z" },
  { id:"g-H-5", fase:"grupos", grupo:"H", rodada:3, mandante:"Uruguai",            visitante:"Espanha",             kickoff:"2026-06-27T00:00:00Z" },
  // GRUPO I
  { id:"g-I-0", fase:"grupos", grupo:"I", rodada:1, mandante:"França",             visitante:"Senegal",             kickoff:"2026-06-16T19:00:00Z" },
  { id:"g-I-1", fase:"grupos", grupo:"I", rodada:1, mandante:"Iraque",             visitante:"Noruega",             kickoff:"2026-06-16T22:00:00Z" },
  { id:"g-I-2", fase:"grupos", grupo:"I", rodada:2, mandante:"França",             visitante:"Iraque",              kickoff:"2026-06-22T21:00:00Z" },
  { id:"g-I-3", fase:"grupos", grupo:"I", rodada:2, mandante:"Noruega",            visitante:"Senegal",             kickoff:"2026-06-23T00:00:00Z" },
  { id:"g-I-4", fase:"grupos", grupo:"I", rodada:3, mandante:"Noruega",            visitante:"França",              kickoff:"2026-06-26T19:00:00Z" },
  { id:"g-I-5", fase:"grupos", grupo:"I", rodada:3, mandante:"Senegal",            visitante:"Iraque",              kickoff:"2026-06-26T19:00:00Z" },
  // GRUPO J
  { id:"g-J-0", fase:"grupos", grupo:"J", rodada:1, mandante:"Argentina",          visitante:"Argélia",             kickoff:"2026-06-17T01:00:00Z" },
  { id:"g-J-1", fase:"grupos", grupo:"J", rodada:1, mandante:"Áustria",            visitante:"Jordânia",            kickoff:"2026-06-17T04:00:00Z" },
  { id:"g-J-2", fase:"grupos", grupo:"J", rodada:2, mandante:"Argentina",          visitante:"Áustria",             kickoff:"2026-06-22T17:00:00Z" },
  { id:"g-J-3", fase:"grupos", grupo:"J", rodada:2, mandante:"Jordânia",           visitante:"Argélia",             kickoff:"2026-06-23T03:00:00Z" },
  { id:"g-J-4", fase:"grupos", grupo:"J", rodada:3, mandante:"Argélia",            visitante:"Áustria",             kickoff:"2026-06-28T02:00:00Z" },
  { id:"g-J-5", fase:"grupos", grupo:"J", rodada:3, mandante:"Jordânia",           visitante:"Argentina",           kickoff:"2026-06-28T02:00:00Z" },
  // GRUPO K
  { id:"g-K-0", fase:"grupos", grupo:"K", rodada:1, mandante:"Portugal",           visitante:"RD Congo",            kickoff:"2026-06-17T17:00:00Z" },
  { id:"g-K-1", fase:"grupos", grupo:"K", rodada:1, mandante:"Uzbequistão",        visitante:"Colômbia",            kickoff:"2026-06-18T02:00:00Z" },
  { id:"g-K-2", fase:"grupos", grupo:"K", rodada:2, mandante:"Portugal",           visitante:"Uzbequistão",         kickoff:"2026-06-23T17:00:00Z" },
  { id:"g-K-3", fase:"grupos", grupo:"K", rodada:2, mandante:"Colômbia",           visitante:"RD Congo",            kickoff:"2026-06-24T02:00:00Z" },
  { id:"g-K-4", fase:"grupos", grupo:"K", rodada:3, mandante:"Colômbia",           visitante:"Portugal",            kickoff:"2026-06-27T23:30:00Z" },
  { id:"g-K-5", fase:"grupos", grupo:"K", rodada:3, mandante:"RD Congo",           visitante:"Uzbequistão",         kickoff:"2026-06-27T23:30:00Z" },
  // GRUPO L
  { id:"g-L-0", fase:"grupos", grupo:"L", rodada:1, mandante:"Inglaterra",         visitante:"Croácia",             kickoff:"2026-06-17T20:00:00Z" },
  { id:"g-L-1", fase:"grupos", grupo:"L", rodada:1, mandante:"Gana",               visitante:"Panamá",              kickoff:"2026-06-17T23:00:00Z" },
  { id:"g-L-2", fase:"grupos", grupo:"L", rodada:2, mandante:"Inglaterra",         visitante:"Gana",                kickoff:"2026-06-23T20:00:00Z" },
  { id:"g-L-3", fase:"grupos", grupo:"L", rodada:2, mandante:"Panamá",             visitante:"Croácia",             kickoff:"2026-06-23T23:00:00Z" },
  { id:"g-L-4", fase:"grupos", grupo:"L", rodada:3, mandante:"Panamá",             visitante:"Inglaterra",          kickoff:"2026-06-27T21:00:00Z" },
  { id:"g-L-5", fase:"grupos", grupo:"L", rodada:3, mandante:"Croácia",            visitante:"Gana",                kickoff:"2026-06-27T21:00:00Z" },
];

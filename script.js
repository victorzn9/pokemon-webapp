let deckId = null;

// Criar baralho embaralhado
async function criarBaralho() {
  const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
  const data = await res.json();
  deckId = data.deck_id;
}

// Aba Cassino: puxar carta aleatória
async function puxarCarta() {
  if (!deckId) await criarBaralho();

  const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
  const data = await res.json();

  const div = document.getElementById("cartaAleatoria");
  if (data.cards.length > 0) {
    div.innerHTML = `<img src="${data.cards[0].image}" alt="${data.cards[0].value} de ${data.cards[0].suit}">`;
  } else {
    div.innerHTML = "<p>Acabaram as cartas! 🔄</p>";
  }
}

// Aba Pesquisa: buscar carta pelo input (funciona com símbolos ou letras)
async function pesquisarCarta() {
  if (!deckId) await criarBaralho();

  const input = document.getElementById("inputCartaCompleta").value.trim();
  if (!input) return alert("Digite a carta!");

  const suitMap = {
    "♠": "S", "S": "S",
    "♥": "H", "H": "H",
    "♦": "D", "D": "D",
    "♣": "C", "C": "C"
  };

  // Separar valor e naipe
  let valor, naipe;
  if (input.length === 2) {
    valor = input[0].toUpperCase();
    naipe = input[1].toUpperCase();
  } else if (input.length === 3) { // ex: 10H ou 10♥
    valor = input.slice(0,2).toUpperCase();
    naipe = input[2].toUpperCase();
  } else {
    return alert("Formato inválido! Ex: A♠, 10H, J♣");
  }

  if (!suitMap[naipe]) return alert("Naipe inválido! Use ♠, ♥, ♦, ♣ ou S,H,D,C");

  const code = valor + suitMap[naipe];

  const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?cards=${code}`);
  const data = await res.json();

  const div = document.getElementById("cartaPesquisada");
  if (data.cards.length > 0) {
    div.innerHTML = `<img src="${data.cards[0].image}" alt="${data.cards[0].value} de ${data.cards[0].suit}">`;
  } else {
    div.innerHTML = "<p>Carta não encontrada! 🔍</p>";
  }
}

// Trocar abas
document.getElementById("tab-cassino").addEventListener("click", () => toggleTab("cassino"));
document.getElementById("tab-pesquisa").addEventListener("click", () => toggleTab("pesquisa"));

function toggleTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

  document.getElementById("tab-" + tab).classList.add("active");
  document.getElementById(tab).classList.add("active");
}

// Inicializa baralho
criarBaralho();

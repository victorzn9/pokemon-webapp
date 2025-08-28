async function pesquisarPokemon() {
  const nome = document.getElementById('inputPokemon').value.trim().toLowerCase();
  const tipoFiltro = document.getElementById('selectTipo').value;
  const geracaoFiltro = document.getElementById('selectGeracao').value;

  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  // Se nome foi digitado, busca diretamente
  if (nome) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
      if (!res.ok) throw new Error("Pokémon não encontrado");

      const data = await res.json();
      if (tipoFiltro && !data.types.some(t => t.type.name === tipoFiltro)) {
        resultadoDiv.innerHTML = "<p>Nenhum Pokémon encontrado com esse tipo.</p>";
        return;
      }

      const gen = await fetch(data.species.url).then(r => r.json());
      const genNumero = parseInt(gen.generation.url.match(/\/(\d+)\/$/)[1]);
      if (geracaoFiltro && genNumero != geracaoFiltro) {
        resultadoDiv.innerHTML = "<p>Nenhum Pokémon encontrado nessa geração.</p>";
        return;
      }

      mostrarPokemon(data, resultadoDiv);

    } catch (err) {
      resultadoDiv.innerHTML = `<p>${err.message}</p>`;
    }
    return;
  }

  // Se nenhum nome digitado, busca por tipo e geração (lista)
  let url = 'https://pokeapi.co/api/v2/pokemon?limit=1500';
  const res = await fetch(url);
  const data = await res.json();

  let resultados = [];

  for (let p of data.results) {
    const pData = await fetch(p.url).then(r => r.json());

    if (tipoFiltro && !pData.types.some(t => t.type.name === tipoFiltro)) continue;

    const genData = await fetch(pData.species.url).then(r => r.json());
    const genNumero = parseInt(genData.generation.url.match(/\/(\d+)\/$/)[1]);
    if (geracaoFiltro && genNumero != geracaoFiltro) continue;

    resultados.push(pData);
    if (resultados.length >= 20) break; // limita resultados
  }

  if (resultados.length === 0) {
    resultadoDiv.innerHTML = "<p>Nenhum Pokémon encontrado.</p>";
    return;
  }

  resultados.forEach(p => mostrarPokemon(p, resultadoDiv));
}

function mostrarPokemon(data, container) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <div class="info">
      <h3>${capitalize(data.name)}</h3>
      <p><strong>Tipo:</strong> ${data.types.map(t => capitalize(t.type.name)).join(', ')}</p>
      <p><strong>Número:</strong> #${data.id}</p>
    </div>
  `;
  container.appendChild(card);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


import "./style.css";

// funcion para buscar un pokemon por nombre, funciona con busquedas parciales tambien
async function buscarPorNombre() {
  const termino = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const resultadoDiv = document.getElementById("resultado");

  if (!termino) {
    resultadoDiv.innerHTML = "<p>por favor, escribi un nombre</p>";
    return;
  }

  resultadoDiv.innerHTML = "buscando pokemons...";

  try {
    const exactResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${termino}`
    );
    if (exactResponse.ok) {
      const exactPokemon = await exactResponse.json();
      mostrarPokemons([exactPokemon]);
      return;
    }

    const allResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1300"
    );
    const data = await allResponse.json();

    const coincidencias = data.results.filter((p) => p.name.includes(termino));

    if (coincidencias.length === 0) {
      resultadoDiv.innerHTML =
        "<p>no se encontro ningun pokemon con ese nombre</p>";
      return;
    }

    const detalles = await Promise.all(
      coincidencias
        .slice(0, 10)
        .map((p) => fetch(p.url).then((res) => res.json()))
    );

    mostrarPokemons(detalles);
  } catch (error) {
    resultadoDiv.innerHTML = "<p>Error al buscar Pokemon.</p>";
    console.error(error);
  }
}

// funcion para buscar pokemons por tipo, ordenados alfabeticamente
async function tipoPokemon() {
  const tipo = document.getElementById("tipoSelect").value;
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `Buscando Pokemons de tipo ${tipo}...`;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
    const data = await response.json();

    const lista = data.pokemon.map((p) => p.pokemon);

    const detalles = await Promise.all(
      lista.map((p) => fetch(p.url).then((res) => res.json()))
    );

    const ordenados = detalles.sort((a, b) => a.name.localeCompare(b.name));

    mostrarPokemons(ordenados);
  } catch (error) {
    resultadoDiv.innerHTML = "<p>error al buscar pokemons por tipo.</p>";
    console.error(error);
  }
}

// funciones para ordenar de forma ascendente y descendente los pokemnos por peso
function ordenarPorPesoAsc() {
  if (!window.ultimaLista) return;
  const ordenados = [...window.ultimaLista].sort((a, b) => a.weight - b.weight);
  mostrarPokemons(ordenados);
}

function ordenarPorPesoDesc() {
  if (!window.ultimaLista) return;
  const ordenados = [...window.ultimaLista].sort((a, b) => b.weight - a.weight);
  mostrarPokemons(ordenados);
}

// funcion para mostrar cada pokemons, usada en tipoPokemon() y buscarPorNombre()
function mostrarPokemons(lista) {
  const resultadoDiv = document.getElementById("resultado");

  resultadoDiv.innerHTML = lista
    .map(
      (pokemon) => `
    <div class="pokemon-card">
      <h2>${pokemon.name.toUpperCase()}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <p>Tipo: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
      <p>Altura: ${pokemon.height / 10} m</p>
      <p>Peso: ${pokemon.weight / 10} kg</p>
      <a href="details.html?name=${pokemon.name}">Ver mss detalles</a>
    </div>
  `
    )
    .join("");

  window.ultimaLista = lista;
}

// event listeners:
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("buscarNombreBtn")
    .addEventListener("click", buscarPorNombre);
  document
    .getElementById("buscarTipoBtn")
    .addEventListener("click", tipoPokemon);
  document
    .getElementById("ordenAscBtn")
    .addEventListener("click", ordenarPorPesoAsc);
  document
    .getElementById("ordenDescBtn")
    .addEventListener("click", ordenarPorPesoDesc);
});

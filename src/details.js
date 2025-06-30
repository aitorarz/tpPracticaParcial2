document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("name");

  const detalleDiv = document.getElementById("detalle");

  if (!nombre) {
    detalleDiv.innerHTML = "<p>Nombre de Pokemon no especificado.</p>";
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!response.ok) throw new Error("No se encontro el Pokemon");

    const pokemon = await response.json();

    detalleDiv.innerHTML = `
      <div class="pokemon-card">
        <h2>${pokemon.name.toUpperCase()}</h2>
        <img src="${
          pokemon.sprites.other["official-artwork"].front_default
        }" alt="${pokemon.name}" />
        <p>Tipo: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
        <p>Altura: ${pokemon.height / 10} m</p>
        <p>Peso: ${pokemon.weight / 10} kg</p>
        <p>Experiencia base: ${pokemon.base_experience}</p>
        <p>Habilidades: ${pokemon.abilities
          .map((a) => a.ability.name)
          .join(", ")}</p>
      </div>
    `;
  } catch (error) {
    detalleDiv.innerHTML = "<p>Error al cargar detalles del Pokemon.</p>";
    console.error(error);
  }
});

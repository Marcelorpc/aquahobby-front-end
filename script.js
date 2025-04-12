document.addEventListener("DOMContentLoaded", async () => {
  try {
    const aquariums = await fetchAquariums();
    console.log(aquariums)
    renderAquariumTable(aquariums);
  } catch (error) {
    console.error("Erro ao carregar aquários:", error);
    document.querySelector("tbody").innerHTML = "<tr><td colspan='5'>Erro ao carregar dados.</td></tr>";
  }
});

// Função para buscar a lista de quarios da API
async function fetchAquariums() {
  try {
    const response = await fetch('http://localhost:5000/aquarios');
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data.aquarios;
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Função para montar a tabela
function renderAquariumTable(aquariums) {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  aquariums.forEach(aquario => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${aquario.nome}</td>
      <td>${aquario.volume}L</td>
      <td>${aquario.temperatura}°</td>
      <td>${aquario.ph}</td>
      <td>
        <button onclick="editAquarium('${aquario.id}')">Editar</button>
        <button onclick="removeAquarium('${aquario.nome}')">Remover</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// Função para remover aquário do banco
async function removeAquarium(nome) {
  try {
    const response = await fetch(`http://localhost:5000/aquario?nome=${nome}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao remover o aquário: ${response.status}`);
    }

    const data = await response.json();
    console.log('Aquário removido:', data);

    // Atualiza a lista de aquários e renderiza a tabela
    const aquariums = await fetchAquariums();
    renderAquariumTable(aquariums);

  } catch (error) {
    console.error('Erro:', error.message);
  }
}
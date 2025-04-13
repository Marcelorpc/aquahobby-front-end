// Função chamada ao carregar
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

// Função chamada ao enviar o formulário
const registerForm = document.getElementById("register-form")
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("aqua-name").value.trim();
  const volume = document.getElementById("aqua-volume").value.trim();
  const temperatura = document.getElementById("aqua-temperature").value.trim();
  const ph = document.getElementById("aqua-ph").value.trim();

  const aquario = {
    nome: nome,
    volume: volume,
    temperatura: temperatura,
    ph: ph
  };

  await registerAquarium(aquario);
  // Atualiza a lista de aquários e renderiza a tabela
  const aquariums = await fetchAquariums();
  renderAquariumTable(aquariums);
  event.target.reset();
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

// Função para cadastrar aquário no banco
async function registerAquarium(aquario) {
  try {
    const response = await fetch('http://localhost:5000/aquario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aquario)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    showModal("Aquário cadastrado com sucesso!");
  } catch (error) {
    showModal(error.message);
  }
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // Atualiza a lista de aquários e renderiza a tabela
    const aquariums = await fetchAquariums();
    renderAquariumTable(aquariums);
    showModal("Aquário removido com sucesso!");
  } catch (error) {
    showModal(error.message);
  }
}

// Função para montar a tabela
function renderAquariumTable(aquariums) {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  if (aquariums.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="5" style="text-align: center; font-style: italic;">
        Ainda não há aquários cadastrados.
      </td>
    `;
    tableBody.appendChild(tr);
    return;
  }

  aquariums.forEach(aquario => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${aquario.nome}</td>
      <td>${aquario.volume}L</td>
      <td>${aquario.temperatura}°</td>
      <td>${aquario.ph}</td>
      <td class="td-action-buttons-wrapper">
        <button onclick="editAquariumModal('${aquario.nome}')">Editar</button>
        <button onclick="removeAquarium('${aquario.nome}')">Remover</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// Função para exibir modal de mensagens
function showModal(message) {
  const modal = document.getElementById('modal');
  const messageElement = document.getElementById('modal-message');
  const closeButton = document.getElementById('close-modal');

  messageElement.textContent = message;
  modal.classList.remove('hidden');

  closeButton.onclick = () => {
    modal.classList.add('hidden');
  };
}

// Função para exibir modal de edição de aquário
function editAquariumModal(nome) {
  const modalContent = document.getElementById("edit-modal-content");

  modalContent.innerHTML = `
    <form id="edit-form">
      <div class="edit-input-wrapper">
        <label for="edit-aqua-name">Nome</label>
        <input type="text" name="name" id="edit-aqua-name" placeholder="Aquário Lagoa Azul">
      </div>
      <div class="edit-input-wrapper">
        <label for="edit-aqua-volume">Volume (L)</label>
        <input type="number" name="volume" id="edit-aqua-volume" placeholder="500">
      </div>
      <div class="edit-input-wrapper">
        <label for="edit-aqua-temperature">Temperatura (C°)</label>
        <input type="number" name="temperatura" id="edit-aqua-temperature" placeholder="22.5">
      </div>
      <div class="edit-input-wrapper">
        <label for="edit-aqua-ph">PH</label>
        <input type="number" name="ph" id="edit-aqua-ph" placeholder="6.5">
      </div>
    </form>
  `;

  const modal = document.getElementById("edit-modal");
  modal.classList.remove("edit-hidden");

  const editSendButton = document.getElementById("edit-form-submit");
  editSendButton.onclick = () => {
    modal.classList.add("edit-hidden");
    sendEditForm(nome);
  };

  const closeButton = document.getElementById("edit-close-modal");
  closeButton.onclick = () => {
    modal.classList.add("edit-hidden");
  };
}

// Função para enviar as edições do aquário
async function sendEditForm(aquaName) {
  const nome = document.getElementById("edit-aqua-name").value.trim();
  const volume = document.getElementById("edit-aqua-volume").value.trim();
  const temperatura = document.getElementById("edit-aqua-temperature").value.trim();
  const ph = document.getElementById("edit-aqua-ph").value.trim();

  const aquario = {};

  if (nome && nome !== "") aquario.nome = nome;
  if (volume !== "") aquario.volume = Number(volume);
  if (temperatura !== "") aquario.temperatura = Number(temperatura);
  if (ph !== "") aquario.ph = Number(ph);
  console.log(aquario)
  try {
    const response = await fetch(`http://localhost:5000/aquario?nome=${aquaName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aquario)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    const aquariums = await fetchAquariums();
    renderAquariumTable(aquariums);
    showModal("Aquário alterado com sucesso!");
  } catch (error) {
    showModal(error.message);
  }
}

// Função que pesquisa um aquário pelo nome e retorna se existe
async function searchAquarium() {
  const nome = document.getElementById("aqua-name").value.trim();
  const nameAvailability = document.getElementById("name-availability");

  if(!nome || nome === "") {
    nameAvailability.innerHTML = `----`
    return
  }

  try {
    const response = await fetch(`http://localhost:5000/aquario?nome=${nome}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();

    if (response.ok) {
      nameAvailability.innerHTML = `indisponível!`
    } else {
      nameAvailability.innerHTML = `disponível!`
    }

  } catch (error) {
    console.error(error.message);
  }
}
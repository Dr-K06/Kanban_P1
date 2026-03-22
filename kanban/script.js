document.addEventListener("DOMContentLoaded", () => {

  let draggedCard = null;

  // 🔹 Criar cartão
  function addCard(columnId) {
    const text = prompt("Digite a tarefa:");
    if (!text) return;

    const card = createCard(text);
    document.querySelector(`#${columnId} .card-container`).appendChild(card);

    saveData(); //  salva após criar
  }

  // 🔹 Criar elemento do cartão
  function createCard(text) {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.textContent = text;

    // Arrastar
    card.addEventListener("dragstart", () => {
      draggedCard = card;
    });

    // Editar
    card.addEventListener("dblclick", () => {
      const novoTexto = prompt("Editar tarefa:", card.textContent);
      if (novoTexto) {
        card.textContent = novoTexto;
        saveData(); // salva após editar
      }
    });

    return card;
  }

  //  Permitir soltar
  document.querySelectorAll(".card-container").forEach(container => {

    container.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    container.addEventListener("drop", () => {
      if (draggedCard) {
        container.appendChild(draggedCard);
        draggedCard = null;

        saveData(); //  salva após mover
      }
    });

  });

  //  SALVAR DADOS
  function saveData() {
    const data = {};

    document.querySelectorAll(".column").forEach(column => {
      const columnId = column.id;
      const cards = [];

      column.querySelectorAll(".card").forEach(card => {
        cards.push(card.textContent);
      });

      data[columnId] = cards;
    });

    localStorage.setItem("kanban", JSON.stringify(data));
  }

  //  CARREGAR DADOS
  function loadData() {
    const data = JSON.parse(localStorage.getItem("kanban"));
    if (!data) return;

    Object.keys(data).forEach(columnId => {
      const container = document.querySelector(`#${columnId} .card-container`);

      data[columnId].forEach(text => {
        const card = createCard(text);
        container.appendChild(card);
      });
    });
  }

  //  carregar ao abrir a página
  loadData();

  //  Botões
  document.getElementById("btn-todo")
    .addEventListener("click", () => addCard("todo"));

  document.getElementById("btn-doing")
    .addEventListener("click", () => addCard("in-progress"));

  document.getElementById("btn-done")
    .addEventListener("click", () => addCard("done"));

});
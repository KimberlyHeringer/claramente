// 🌟 Variáveis globais
const toggleBtn = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll("#category-filter button");
const linkList = document.getElementById("link-list");

const form = document.getElementById("link-form");
const titleInput = document.getElementById("link-title");
const urlInput = document.getElementById("link-url");
const categorySelect = document.getElementById("link-category");


// 🌗 Modo escuro/claro
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  toggleBtn.textContent = document.body.classList.contains("dark-theme")
    ? "☀️ Modo Claro"
    : "🌙 Modo Escuro";
});

// 🔍 Busca
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  document.querySelectorAll("#link-list ul li").forEach((li) => {
    const text = li.textContent.toLowerCase();
    li.style.display = text.includes(searchTerm) ? "flex" : "none";
  });
});

// 🧭 Filtro por categoria
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    document.querySelectorAll(".category-block").forEach((block) => {
      block.style.display = (category === "all" || block.id === category)
        ? "block"
        : "none";
    });
  });
});

// ➕ Adicionar link na página
function addLinkToPage(title, url, category) {
  const categoryBlock = document.getElementById(category);
  if (!categoryBlock) return;

  const categoryList = categoryBlock.querySelector("ul");
  if (!categoryList) return;

  const li = document.createElement("li");

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.textContent = title;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.className = "delete-btn";

  deleteBtn.addEventListener("click", () => {
    deleteLink(title, url, category);
    li.remove();
  });

  li.appendChild(link);
  li.appendChild(deleteBtn);
  categoryList.appendChild(li);
}

// 🚀 Carregar links ao abrir a página
function loadLinks() {
  savedLinks.forEach((link) => {
    addLinkToPage(link.title, link.url, link.category);
  });
}

// 📥 Evento de envio do formulário
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const url = urlInput.value.trim();
  const category = categorySelect.value;

  if (!title || !url || !category) return;

  addLinkToPage(title, url, category);
  saveLink(title, url, category);

  titleInput.value = "";
  urlInput.value = "";
  categorySelect.selectedIndex = 0;
});

// 🛡️ Acesso por atalho Ctrl + Alt + A
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
    const loginPanel = document.getElementById("admin-login");
    if (loginPanel) loginPanel.classList.remove("hidden");
  }
});

// 🔒 Login do administrador
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("admin-user").value;
  const pass = document.getElementById("admin-pass").value;

  if (user === "admin" && pass === "claramente123") {
    document.getElementById("admin-login").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
  } else {
    alert("Usuário ou senha incorretos!");
  }

// ▶️ Executa ao carregar
loadLinks();   

<script>
  const scriptURL = "https://script.google.com/macros/s/AKfycbw_VuhdXt291Uzkwovlsi7SSWXqdqDyHD3CxMH-enx-eYq3B-ywVsAMhtG8hiBjv80T/exec"; // Substitua com seu link do Google Apps Script
  const form = document.getElementById('meuFormulario');
  const statusEnvio = document.getElementById('statusEnvio');

  form.addEventListener('submit', e => {
    e.preventDefault(); // Impede o recarregamento da página

    const dados = new FormData(form);

    fetch(scriptURL, { method: 'POST', body: dados })
      .then(response => {
        statusEnvio.innerHTML = "Enviado com sucesso!";
        form.reset();
      })
      .catch(error => {
        statusEnvio.innerHTML = "Erro ao enviar. Tente novamente.";
        console.error('Erro:', error);
      });
  });
</script>

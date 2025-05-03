// 🌟 Variáveis globais
const toggleBtn = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll("#category-filter button");
const linkList = document.getElementById("link-list");
const form = document.getElementById("link-form");
const titleInput = document.getElementById("link-title");
const urlInput = document.getElementById("link-url");
const categorySelect = document.getElementById("link-category");

// URL do Google Apps Script
const scriptURL = 'https://script.google.com/macros/s/AKfycbzfhccxHP3Phetk2KuJuSZX9QD9Yh7krT9Sn4wIPuWeCD9kwTcPBWgzh1TfePL3sSw3/exec';

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

  li.appendChild(link);
  li.appendChild(deleteBtn);
  categoryList.appendChild(li);
}

// 💾 Salvar link no Google Sheets
function saveLink(title, url, category) {
  const data = {
    title: title,
    url: url,
    category: category,
    action: 'add'
  };

  fetch(scriptURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Link salvo com sucesso:', data);
    showNotification('Link adicionado com sucesso!');
  })
  .catch(error => {
    console.error('Erro:', error);
    showNotification('Erro ao salvar o link', 'error');
  });
}

// 📤 Carregar links do Google Sheets (VERSÃO CORRIGIDA)
function loadLinks() {
  showLoading(true);
  
  // Adicionando timestamp para evitar cache
  const timestamp = new Date().getTime();
  fetch(`${scriptURL}?action=get&t=${timestamp}`)
    .then(response => {
      if (!response.ok) throw new Error('Erro na resposta da rede');
      return response.json();
    })
    .then(data => {
      console.log('Dados recebidos:', data);
      
      // Limpa todos os links antes de carregar os novos
      document.querySelectorAll('#link-list ul').forEach(ul => {
        ul.innerHTML = '';
      });
      
      if (data && Array.isArray(data)) {
        data.forEach(link => {
          if (link.title && link.url && link.category) {
            // Garante que a categoria está no formato correto
            const correctedCategory = link.category.toLowerCase().replace(/\s+/g, '-');
            addLinkToPage(link.title, link.url, correctedCategory);
          }
        });
      } else {
        showNotification('Nenhum link encontrado na planilha', 'info');
      }
    })
    .catch(error => {
      console.error('Erro ao carregar links:', error);
      showNotification('Erro ao carregar links da planilha', 'error');
    })
    .finally(() => {
      showLoading(false);
    });
}

// 🗑️ Deletar link
function deleteLink(title, url, category) {
  const data = {
    title: title,
    url: url,
    category: category,
    action: 'delete'
  };

  fetch(scriptURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Link deletado com sucesso:', data);
    showNotification('Link excluído com sucesso!');
  })
  .catch(error => {
    console.error('Erro:', error);
    showNotification('Erro ao excluir o link', 'error');
  });
}

// 📥 Evento de envio do formulário
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const url = urlInput.value.trim();
  const category = categorySelect.value;

  if (!title || !url || !category) {
    showNotification('Preencha todos os campos', 'error');
    return;
  }

  // Validação básica de URL
  try {
    new URL(url);
  } catch (e) {
    showNotification('URL inválida', 'error');
    return;
  }

  addLinkToPage(title, url, category);
  saveLink(title, url, category);

  titleInput.value = "";
  urlInput.value = "";
  categorySelect.selectedIndex = 0;
});

// 🔒 Login do administrador
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("admin-user").value;
    const pass = document.getElementById("admin-pass").value;

    if (user === "admin" && pass === "claramente123") {
      document.getElementById("admin-login").classList.add("hidden");
      document.getElementById("admin-panel").classList.remove("hidden");
      showNotification('Login realizado com sucesso!');
    } else {
      showNotification('Usuário ou senha incorretos!', 'error');
    }
  });
}

// 🛡️ Acesso por atalho Ctrl + Alt + A
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
    const loginPanel = document.getElementById("admin-login");
    if (loginPanel) loginPanel.classList.remove("hidden");
  }
});

// 🔔 Mostrar notificações
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// ⏳ Mostrar/ocultar loading
function showLoading(show) {
  const loading = document.getElementById('loading-indicator');
  if (loading) {
    loading.style.display = show ? 'block' : 'none';
  }
}

// ▶️ Executa ao carregar
document.addEventListener('DOMContentLoaded', () => {
  // Adiciona o indicador de loading se não existir
  if (!document.getElementById('loading-indicator')) {
    const loading = document.createElement('div');
    loading.id = 'loading-indicator';
    loading.style.display = 'none';
    loading.innerHTML = '<div class="spinner"></div><p>Carregando...</p>';
    document.body.appendChild(loading);
  }
  
  loadLinks();
});

// Configuração do formulário de contato
const contactForm = document.getElementById('meuFormulario');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const statusEnvio = document.getElementById('statusEnvio');
    
    const dados = new FormData(contactForm);
    
    statusEnvio.textContent = "Enviando...";
    statusEnvio.style.color = "blue";
    
    fetch(scriptURL, { 
      method: 'POST', 
      body: dados,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          statusEnvio.textContent = "Enviado com sucesso!";
          statusEnvio.style.color = "green";
          contactForm.reset();
        } else {
          throw new Error('Erro na resposta');
        }
      })
      .catch(error => {
        statusEnvio.textContent = "Erro ao enviar. Tente novamente.";
        statusEnvio.style.color = "red";
        console.error('Erro:', error);
      });
  });
}

// Teste de conexão com a planilha
console.log('Testando conexão com a planilha...');
fetch(`${scriptURL}?action=get&t=${new Date().getTime()}`)
  .then(response => {
    console.log('Status da resposta:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Dados recebidos:', data);
    if (data && data.length > 0) {
      console.log('Primeiro link:', data[0]);
    } else {
      console.log('A planilha está vazia ou não retornou dados');
    }
  })
  .catch(error => {
    console.error('Erro no teste:', error);
  });

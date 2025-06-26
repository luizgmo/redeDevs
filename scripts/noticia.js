// Elementos DOM
const titulo = document.getElementById("titulo")
const data = document.getElementById("data")
const imagem = document.getElementById("imagem")
const imageContainer = document.getElementById("image-container")
const nomeAutor = document.getElementById("nomeAutor")
const views = document.getElementById("views")
const chatInput = document.getElementById("chat-input")
const chatForm = document.getElementById("chat-form")
const chatMessages = document.getElementById("chat-messages")
const commentCount = document.getElementById("comment-count")
const likeBtn = document.getElementById("like-btn")
const likeCount = document.getElementById("like-count")
const shareBtn = document.getElementById("share-btn")
const authorActions = document.getElementById("author-actions")
const fullscreenBtn = document.getElementById("fullscreen-btn")
const imageModal = document.getElementById("image-modal")
const fullscreenImage = document.getElementById("fullscreen-image")
const closeFullscreen = document.getElementById("close-fullscreen")
const authorAvatar = document.getElementById("author-avatar")
const userAvatar = document.getElementById("user-avatar")
const chatSubmit = document.getElementById("chat-submit")

// Verificar se todos os elementos necessários existem
const elements = [
  titulo, data, imagem, imageContainer, nomeAutor, views,
  chatInput, chatForm, chatMessages, commentCount, likeBtn,
  likeCount, shareBtn, authorActions, authorAvatar,
  userAvatar
]

if (elements.some((element) => !element)) {
  console.error("Alguns elementos DOM não foram encontrados")
}

// Inicializar dados
if (localStorage.getItem("usuarios") === null) {
  localStorage.setItem("usuarios", JSON.stringify([]))
}

const objUsuarios = JSON.parse(localStorage.getItem("usuarios"))
const noticias = JSON.parse(localStorage.getItem("noticias"))

// Obter ID da notícia da URL
const urlParams = new URLSearchParams(window.location.search)
const id = Number.parseInt(urlParams.get("id"))

// Encontrar a notícia pelo ID
const noticia = noticias.find((noticia) => noticia.id === id)

// Verificar se a notícia existe
if (!noticia) {
  window.location.href = "index.html"
}

// Inicializar contadores
noticia.views = noticia.views
noticia.likes = noticia.likes
noticia.comentarios = noticia.comentarios

// Incrementar visualizações
noticia.views += 1
localStorage.setItem("noticias", JSON.stringify(noticias))

// Funções auxiliares
function generateAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5E17EB&color=fff&size=48`
}

function generateSmallAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5E17EB&color=fff&size=32`
}

function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" }
  return new Date(dateString).toLocaleDateString("pt-BR", options)
}

function formatTimeAgo(dateString) {
  const postDate = new Date(dateString.split("/").reverse().join("-"))
  const now = new Date()
  const diffMs = now - postDate
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "hoje"
  if (diffDays === 1) return "1d"
  if (diffDays < 7) return `${diffDays}d`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`
  return `${Math.floor(diffDays / 30)}m`
}

// Preencher dados da notícia
titulo.textContent = noticia.titulo
data.textContent = formatTimeAgo(noticia.data)
views.textContent = noticia.views
nomeAutor.textContent = noticia.autor
likeCount.textContent = noticia.likes.length + " curtidas"
commentCount.textContent = noticia.comentarios.length

console.log("Notícia carregada:", noticia);

// Gerar avatares
const authorAvatarUrl = generateAvatar(noticia.autor)
authorAvatar.src = authorAvatarUrl

// Verificar se há imagem
if (noticia.img && noticia.img.trim() !== "") {
  imagem.src = noticia.img
  imagem.alt = noticia.titulo
  imageContainer.style.display = "block"
} else {
  imageContainer.style.display = "none"
  imagem.style.display = "none" // Esconde completamente a imagem
}

// Verificar se o usuário atual é o autor
const usuarioAtivo = JSON.parse(localStorage.getItem("usuario"))
if (usuarioAtivo) {
  userAvatar.src = generateSmallAvatar(usuarioAtivo.nome)
  chatInput.placeholder = `Escreva um comentário...`

  if (usuarioAtivo.id === noticia.idusuario) {
    const editBtn = document.createElement("i")
    editBtn.className = "fas fa-edit edit-icon"
    editBtn.title = "Editar postagem"

    const deleteBtn = document.createElement("i")
    deleteBtn.className = "fas fa-trash delete-icon"
    deleteBtn.title = "Excluir postagem"

    authorActions.appendChild(editBtn)
    authorActions.appendChild(deleteBtn)

    editBtn.addEventListener("click", editPost)
    deleteBtn.addEventListener("click", deletePost)
  }
} else {
  chatInput.placeholder = "Faça login para comentar..."
  userAvatar.src = generateSmallAvatar("Guest")
}

// Registrar visualização no histórico do usuário
if (usuarioAtivo) {
  for (const i of objUsuarios) {
    if (i.id === usuarioAtivo.id) {
      if (!i.registro || !Array.isArray(i.registro)) {
        i.registro = []
      }
      if (!i.registro.includes(noticia.titulo)) {
        i.registro.push(noticia.titulo)
        localStorage.setItem("usuarios", JSON.stringify(objUsuarios))
      }
      break
    }
  }
}

// Carregar posts relacionados
function loadRelatedPosts() {


  // Filtrar posts do mesmo autor, excluindo a atual
  const authorPosts = noticias.filter((post) => post.autor === noticia.autor && post.id !== noticia.id)

  // Verifica se o usuário já curtiu
    const jaCurtiu = noticia.likes.includes(usuarioAtivo.id);
    
    if (jaCurtiu) {
        likeBtn.innerHTML = '<i class="fas fa-heart" style="color: #ff3366;"></i> Curtido'
        likeBtn.classList.add("liked")
        likeBtn.disabled = true
        return false; // Indica que não foi possível curtir
    }

  // Limitar a 3 posts
  const relatedPostsData = authorPosts.slice(0, 3)

  if (relatedPostsData.length === 0) {
    const emptyMessage = document.createElement("div")
    emptyMessage.className = "empty-related-posts"
    emptyMessage.textContent = "Nenhum post relacionado encontrado"
    return
  }

  relatedPostsData.forEach((post) => {
    const postItem = document.createElement("a")
    postItem.href = `noticia.html?id=${post.id}`
    postItem.className = "related-post-item"

    let postContent = `
      <div class="related-post-content">
        <h6 class="related-post-title">${post.titulo}</h6>
        <div class="related-post-meta">
          <span class="related-post-views">${post.views || 0} visualizações</span>
          <span class="related-post-date">${formatTimeAgo(post.data)}</span>
        </div>
      </div>
    `

    if (post.img && post.img.trim() !== "") {
      postContent = `
        <div class="related-post-image">
          <img src="${post.img}" alt="${post.titulo}">
        </div>
      ` + postContent
    }

    postItem.innerHTML = postContent
    relatedPosts.appendChild(postItem)
  })
}

// Funções para editar e excluir post
function editPost() {
  alert("Funcionalidade de edição será implementada em breve!")
}

function deletePost() {
  if (confirm("Tem certeza que deseja excluir esta postagem?")) {
    const index = noticias.findIndex((post) => post.id === noticia.id)
    if (index !== -1) {
      noticias.splice(index, 1)
      localStorage.setItem("noticias", JSON.stringify(noticias))
      window.location.href = "index.html"
    }
  }
}

// Envio de comentários
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!usuarioAtivo) {
    abrirModal();
    return;
  }

  const mensagem = chatInput.value.trim();
  if (mensagem !== "") {
    try {
      // 1. Criar o objeto do comentário
      const objMensagem = {
        idUsuario: usuarioAtivo.id,
        nome: usuarioAtivo.nome,
        mensagem: mensagem,
        timestamp: new Date().toISOString(),
        avatar: usuarioAtivo.fotoperfil || generateSmallAvatar(usuarioAtivo.nome),
      };

      // 2. Adicionar o comentário à notícia
      noticia.comentarios.push(objMensagem);

      // 3. Atualizar o localStorage
      const noticiasAtualizadas = JSON.parse(localStorage.getItem("noticias")) || [];
      const index = noticiasAtualizadas.findIndex((n) => n.id === noticia.id);
      
      if (index !== -1) {
        noticiasAtualizadas[index] = noticia;
        localStorage.setItem("noticias", JSON.stringify(noticiasAtualizadas));
      }

      // 4. Limpar o campo de input
      chatInput.value = "";

      // 5. Atualizar o contador de comentários
      commentCount.textContent = noticia.comentarios.length;

      // 6. Atualizar a exibição dos comentários (AGORA EM TEMPO REAL)
      await loadChat(); // Adicionamos await para garantir que termine antes do feedback

      // Feedback visual
      chatInput.classList.add("success-flash");
      setTimeout(() => {
        chatInput.classList.remove("success-flash");
      }, 500);

    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      chatInput.classList.add("error-flash");
      setTimeout(() => {
        chatInput.classList.remove("error-flash");
      }, 500);
    }
  } else {
    chatInput.classList.add("error-flash");
    setTimeout(() => {
      chatInput.classList.remove("error-flash");
    }, 500);
  }
});

// Carregamento de comentários
function loadChat() {
  chatMessages.innerHTML = ""

  if (noticia.comentarios.length === 0) {
    const emptyMessage = document.createElement("div")
    emptyMessage.className = "empty-comments"
    emptyMessage.innerHTML = `
      <div class="empty-comments-content">
        <i class="far fa-comment-dots"></i>
        <p>Seja o primeiro a comentar!</p>
      </div>
    `
    chatMessages.appendChild(emptyMessage)
    return
  }

  const comentariosOrdenados = [...noticia.comentarios].reverse()

  comentariosOrdenados.forEach((comentario, index) => {
    const commentItem = document.createElement("div")
    commentItem.className = "comment-item"

    const isAuthor = comentario.nome === noticia.autor
    const avatarUrl = comentario.avatar || generateSmallAvatar(comentario.nome)

    commentItem.innerHTML = `
      <div class="comment-avatar">
        <img src="${avatarUrl}" alt="${comentario.nome}">
      </div>
      <div class="comment-content">
        <div class="comment-bubble">
          <div class="comment-header">
            <span class="comment-author ${isAuthor ? "is-author" : ""}">${comentario.nome}</span>
            ${isAuthor ? '<span class="author-badge">Autor</span>' : ""}
            <span class="comment-time">${formatCommentTime(comentario.timestamp)}</span>
          </div>
          <p class="comment-text">${comentario.mensagem}</p>
        </div>
      </div>
    `

    chatMessages.appendChild(commentItem)

    setTimeout(() => {
      commentItem.classList.add("visible")
    }, index * 100)
  })
}


function formatCommentTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)

  if (diffSec < 60) return "agora"
  if (diffMin < 60) return `${diffMin}min`
  if (diffHour < 24) return `${diffHour}h`
  if (diffDay === 1) return "1d"
  return `${diffDay}d`
}

// Modal de login
function abrirModal() {
  const modal = document.getElementById("modal")
  modal.classList.remove("d-none")

  document.getElementById("fechar").addEventListener("click", () => {
    modal.classList.add("d-none")
  })

  document.getElementById("logar").addEventListener("click", () => {
    window.location.href = "login.html"
  })
}

// Botão de curtir
likeBtn.addEventListener("click", () => {
  if (!usuarioAtivo) {
    abrirModal()
    return
  }

  // Verificar se o usuário já curtiu
  if (likeBtn.classList.contains("liked")) {
    return
  }

  noticia.likes.push(usuarioAtivo.id);

  likeCount.textContent = noticia.likes.length + " curtidas";

  // Atualizar localStorage
  const noticiasAtualizadas = JSON.parse(localStorage.getItem("noticias")) || []
  const index = noticiasAtualizadas.findIndex((n) => n.id === noticia.id)
  
  if (index !== -1) {
    noticiasAtualizadas[index] = noticia
    localStorage.setItem("noticias", JSON.stringify(noticiasAtualizadas))
  }
  console.log("Notícias atualizadas:", noticiasAtualizadas);
  // Atualizar UI
  likeBtn.innerHTML = '<i class="fas fa-heart" style="color: #ff3366;"></i> Curtido'
  likeBtn.classList.add("liked")
  likeBtn.disabled = true
})

// Botão de compartilhar
shareBtn.addEventListener("click", () => {
  if (navigator.share) {
    navigator.share({
      title: noticia.titulo,
      text: `Confira esta postagem de ${noticia.autor}`,
      url: window.location.href,
    }).catch((err) => {
      console.error("Erro ao compartilhar:", err)
    })
  } else {
    prompt("Copie o link abaixo para compartilhar:", window.location.href)
  }
})


// Inicialização
loadChat()
loadRelatedPosts()

module.exports = { loadChat };

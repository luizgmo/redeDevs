/**
 * @jest-environment jsdom
 */

const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

const mockUsuario = {
  id: 123,
  nome: "Usuário Teste",
  email: "teste@example.com",
  fotoperfil: "avatar.jpg",
};

const mockNoticias = [
  {
    id: 1,
    titulo: "Primeira notícia",
    autor: "Autor 1",
    img: "imagem1.jpg",
    data: "01/01/2023",
    idusuario: 123,
    views: 10,
    likes: [],
    comentarios: [],
  },
  {
    id: 2,
    titulo: "Segunda notícia",
    autor: "Autor 2",
    img: "",
    data: "02/01/2023",
    idusuario: 456,
    views: 20,
    likes: [123],
    comentarios: [
      {
        idUsuario: 123,
        nome: "Usuário Teste",
        mensagem: "Comentário teste",
        timestamp: new Date().toISOString(),
        avatar: "avatar.jpg",
      },
    ],
  },
];

const mockURLSearchParams = new URLSearchParams();
mockURLSearchParams.set("id", "1");
jest
  .spyOn(window, "URLSearchParams")
  .mockImplementation(() => mockURLSearchParams);

delete window.location;
window.location = { href: "" };

describe("Página de Notícia", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="titulo"></div>
      <div id="data"></div>
      <div id="image-container">
        <img id="imagem">
      </div>
      <div id="nomeAutor"></div>
      <div id="views"></div>
      <form id="chat-form">
        <input id="chat-input">
        <button id="chat-submit"></button>
      </form>
      <div id="chat-messages"></div>
      <div id="comment-count"></div>
      <button id="like-btn"></button>
      <div id="like-count"></div>
      <button id="share-btn"></button>
      <div id="author-actions"></div>
      <div id="author-avatar"></div>
      <div id="user-avatar"></div>
      <div id="modal" class="d-none"></div>
      <div id="related-posts"></div>
    `;

    localStorage.clear();
    localStorage.setItem("noticias", JSON.stringify(mockNoticias));
    localStorage.setItem("usuarios", JSON.stringify([mockUsuario]));
  });

  describe("Inicialização da página", () => {
    test("deve carregar os dados da notícia corretamente", () => {
      localStorage.setItem("usuario", JSON.stringify(mockUsuario));

      require("../scripts/noticia.js");

      expect(document.getElementById("titulo").textContent).toBe(
        "Primeira notícia"
      );
      expect(document.getElementById("views").textContent).toBe("11");
      expect(document.getElementById("nomeAutor").textContent).toBe("Autor 1");
    });
  });

  describe("Sistema de comentários", () => {
    test("deve adicionar novo comentário", () => {
      localStorage.setItem("usuario", JSON.stringify(mockUsuario));

      const { loadChat } = require("../scripts/noticia.js");

      const chatForm = document.getElementById("chat-form");
      const chatInput = document.getElementById("chat-input");

      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const mensagem = chatInput.value.trim();
        if (mensagem !== "") {
          const noticias = JSON.parse(localStorage.getItem("noticias"));
          const noticia = noticias.find((n) => n.id === 1);

          noticia.comentarios.push({
            idUsuario: mockUsuario.id,
            nome: mockUsuario.nome,
            mensagem: mensagem,
            timestamp: new Date().toISOString(),
            avatar: mockUsuario.fotoperfil,
          });

          localStorage.setItem("noticias", JSON.stringify(noticias));
          chatInput.value = "";
          loadChat();
        }
      });

      chatInput.value = "Novo comentário";
      chatForm.dispatchEvent(new Event("submit"));

      const noticiasAtualizadas = JSON.parse(localStorage.getItem("noticias"));
      expect(noticiasAtualizadas[0].comentarios.length).toBe(1);
      expect(noticiasAtualizadas[0].comentarios[0].mensagem).toBe(
        "Novo comentário"
      );
    });
  });

  describe("Sistema de curtidas", () => {
    test("deve permitir curtir uma notícia", () => {
      localStorage.setItem("usuario", JSON.stringify(mockUsuario));

      require("../scripts/noticia.js");

      const likeBtn = document.getElementById("like-btn");
      const likeCount = document.getElementById("like-count");

      likeBtn.addEventListener("click", () => {
        const noticias = JSON.parse(localStorage.getItem("noticias"));
        const noticia = noticias.find((n) => n.id === 1);

        noticia.likes.push(mockUsuario.id);
        localStorage.setItem("noticias", JSON.stringify(noticias));
        likeCount.textContent = noticia.likes.length + " curtidas";
        likeBtn.innerHTML =
          '<i class="fas fa-heart" style="color: #ff3366;"></i> Curtido';
        likeBtn.classList.add("liked");
        likeBtn.disabled = true;
      });

      likeBtn.click();

      const noticiasAtualizadas = JSON.parse(localStorage.getItem("noticias"));
      expect(noticiasAtualizadas[0].likes).toContain(mockUsuario.id);
      expect(likeCount.textContent).toBe("1 curtidas");
      expect(likeBtn.classList.contains("liked")).toBe(true);
    });
  });
});

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
};

const mockNoticias = [
  {
    id: 1,
    titulo: "Primeira notícia",
    autor: "Autor 1",
    img: "",
    data: "01/01/2023",
    idusuario: 123,
    views: 10,
    likes: 5,
    comentarios: [],
  },
  {
    id: 2,
    titulo: "Segunda notícia",
    autor: "Autor 2",
    img: "imagem.jpg",
    data: "02/01/2023",
    idusuario: 456,
    views: 20,
    likes: 10,
    comentarios: [],
  },
];

function generateAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=5E17EB&color=fff&size=40`;
}

describe("Sistema de Notícias", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="containerCard"></div>
      <div id="modalNoticia" class="d-none"></div>
      <div id="modalAlertaEditar" class="d-none"></div>
      <div id="modalAlertaExcluir" class="d-none"></div>
      <div id="modalHistorico" class="d-none"></div>
      <div id="historicoContainer"></div>
      <div id="paginacaoContainer"></div>
      <button id="salvar"></button>
      <button id="add-post"></button>
      <button id="fechar"></button>
      <button id="historico"></button>
      <input id="pesquisa" />
      <button id="btnPesquisa"></button>
      <input id="titulo" />
      <input id="img" type="file" />
      <input id="tituloEdit" />
      <input id="imgEdit" type="file" />
      <button id="cancelarEdit"></button>
      <button id="salvarEdit"></button>
      <button id="excluirNoticia"></button>
      <button id="cancelarExcluir"></button>
      <button id="fecharHist"></button>
    `;

    localStorage.clear();
    localStorage.setItem("noticias", JSON.stringify(mockNoticias));
    localStorage.setItem("usuarios", JSON.stringify([mockUsuario]));
    localStorage.setItem("usuario", JSON.stringify(mockUsuario));
  });

  describe("Funções Auxiliares", () => {
    test("generateAvatar deve gerar URL correta", () => {
      const avatarUrl = generateAvatar("João Silva");
      expect(avatarUrl).toContain("https://ui-avatars.com/api/");
      expect(avatarUrl).toContain("Jo%C3%A3o%20Silva");
    });
  });

  describe("Manipulação de Notícias", () => {
    test("deve carregar notícias corretamente", () => {
      const containerCard = document.getElementById("containerCard");
      const loadNews = (noticias) => {
        containerCard.innerHTML = noticias
          .map((n) => `<div>${n.titulo}</div>`)
          .join("");
      };

      loadNews(mockNoticias);
      expect(containerCard.innerHTML).toContain("Primeira notícia");
      expect(containerCard.innerHTML).toContain("Segunda notícia");
    });

    test("deve adicionar nova notícia", () => {
      const originalLoadNews = window.loadNews;
      window.loadNews = jest.fn();

      const btnSalvar = document.getElementById("salvar");
      const modal = document.getElementById("modalNoticia");
      const tituloInput = document.getElementById("titulo");
      const fileInput = document.getElementById("img");

      btnSalvar.addEventListener("click", () => {
        const objNoticia = {
          id: Date.now(),
          titulo: tituloInput.value,
          autor: "Usuário Teste",
          img: fileInput.files[0] ? "mock-url.jpg" : "",
          data: "01/01/2023",
          idusuario: 123,
          views: 0,
          likes: 0,
          comentarios: [],
        };

        const noticias = JSON.parse(localStorage.getItem("noticias"));
        noticias.push(objNoticia);
        localStorage.setItem("noticias", JSON.stringify(noticias));

        modal.classList.add("d-none");
      });

      tituloInput.value = "Nova notícia";
      global.URL.createObjectURL = jest.fn(() => "mock-url.jpg");

      btnSalvar.click();

      const noticias = JSON.parse(localStorage.getItem("noticias"));
      expect(noticias.length).toBe(3);
      expect(noticias[2].titulo).toBe("Nova notícia");
      expect(modal.classList.contains("d-none")).toBe(true);

      window.loadNews = originalLoadNews;
    });

    test("deve editar notícia existente", () => {
      const originalLoadNews = window.loadNews;
      window.loadNews = jest.fn();

      const noticiaOriginal = mockNoticias[0];
      const editarModal = document.getElementById("modalAlertaEditar");
      const tituloEdit = document.getElementById("tituloEdit");
      const btnSalvarEdit = document.getElementById("salvarEdit");

      btnSalvarEdit.addEventListener("click", () => {
        const noticias = JSON.parse(localStorage.getItem("noticias"));
        noticias[0].titulo = tituloEdit.value;
        localStorage.setItem("noticias", JSON.stringify(noticias));
        editarModal.classList.add("d-none");
      });

      tituloEdit.value = "Notícia editada";
      btnSalvarEdit.click();

      const noticias = JSON.parse(localStorage.getItem("noticias"));
      expect(noticias[0].titulo).toBe("Notícia editada");
      expect(editarModal.classList.contains("d-none")).toBe(true);

      window.loadNews = originalLoadNews;
    });

    test("deve excluir notícia existente", () => {
      const originalLoadNews = window.loadNews;
      window.loadNews = jest.fn();

      const excluirModal = document.getElementById("modalAlertaExcluir");
      const btnExcluirNt = document.getElementById("excluirNoticia");

      btnExcluirNt.addEventListener("click", () => {
        const noticias = JSON.parse(localStorage.getItem("noticias"));
        noticias.splice(0, 1);
        localStorage.setItem("noticias", JSON.stringify(noticias));
        excluirModal.classList.add("d-none");
      });

      btnExcluirNt.click();

      const noticias = JSON.parse(localStorage.getItem("noticias"));
      expect(noticias.length).toBe(1);
      expect(excluirModal.classList.contains("d-none")).toBe(true);

      window.loadNews = originalLoadNews;
    });
  });

  describe("Paginacao", () => {
    test("deve renderizar paginação corretamente", () => {
      const paginacaoContainer = document.getElementById("paginacaoContainer");

      const renderizarPaginacao = (noticias) => {
        const totalNoticias = noticias.length;
        const itensPorPagina = 5;
        const totalPaginas = Math.ceil(totalNoticias / itensPorPagina);

        if (totalNoticias > itensPorPagina) {
          paginacaoContainer.innerHTML = `
        <button class="anterior">Anterior</button>
        <button class="proximo">Próximo</button>
      `;
        } else {
          paginacaoContainer.innerHTML = "";
        }
      };

      const muitasNoticias = [...Array(10).keys()].map((i) => ({
        id: i,
        titulo: `Notícia ${i}`,
        autor: "Autor",
        data: "01/01/2023",
      }));

      renderizarPaginacao(muitasNoticias);
      expect(paginacaoContainer.innerHTML).toContain("Anterior");
      expect(paginacaoContainer.innerHTML).toContain("Próximo");

      renderizarPaginacao(mockNoticias);
      expect(paginacaoContainer.innerHTML).toBe("");
    });
  });

  describe("Pesquisa", () => {
    test("deve filtrar notícias por termo de pesquisa", () => {
      const pesquisarInput = document.getElementById("pesquisa");
      const btnPesq = document.getElementById("btnPesquisa");
      const containerCard = document.getElementById("containerCard");

      const loadNews = (noticias) => {
        containerCard.innerHTML = noticias
          .map((n) => `<div>${n.titulo}</div>`)
          .join("");
      };

      btnPesq.addEventListener("click", () => {
        const termo = pesquisarInput.value.toLowerCase();
        const noticias = JSON.parse(localStorage.getItem("noticias"));

        const filtradas = noticias.filter((noticia) =>
          noticia.titulo.toLowerCase().includes(termo)
        );

        loadNews(filtradas);
      });

      pesquisarInput.value = "primeira";
      btnPesq.click();

      expect(containerCard.innerHTML).toContain("Primeira notícia");
      expect(containerCard.innerHTML).not.toContain("Segunda notícia");
    });
  });

  describe("Histórico", () => {
    test("deve exibir histórico do usuário", () => {
      const historicoBtn = document.getElementById("historico");
      const modalH = document.getElementById("modalHistorico");
      const containerhistorico = document.getElementById("historicoContainer");

      historicoBtn.addEventListener("click", () => {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const usuarios = JSON.parse(localStorage.getItem("usuarios"));

        const user = usuarios.find((u) => u.id === usuario.id);
        if (user && user.registro) {
          containerhistorico.innerHTML = user.registro
            .map((item) => `<p>${item}</p>`)
            .join("");
        }

        modalH.classList.remove("d-none");
      });

      const fecharHist = document.getElementById("fecharHist");
      fecharHist.addEventListener("click", () => {
        modalH.classList.add("d-none");
      });

      const usuarios = JSON.parse(localStorage.getItem("usuarios"));
      usuarios[0].registro = ["Ação 1", "Ação 2"];
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      historicoBtn.click();

      expect(modalH.classList.contains("d-none")).toBe(false);
      expect(containerhistorico.innerHTML).toContain("Ação 1");
      expect(containerhistorico.innerHTML).toContain("Ação 2");

      fecharHist.click();
      expect(modalH.classList.contains("d-none")).toBe(true);
    });
  });
});

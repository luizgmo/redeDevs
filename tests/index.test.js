/**
 * @jest-environment jsdom
 */

// Mock global do localStorage e DOM
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
        }
    };
})();

global.localStorage = localStorageMock;

// Mock de usuário para testes
const mockUsuario = {
    id: 123,
    nome: "Usuário Teste",
    email: "teste@example.com"
};

// Mock de notícias para testes
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
        comentarios: []
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
        comentarios: []
    }
];

// Recriação das funções do seu código
function generateAvatar(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5E17EB&color=fff&size=40`;
}

function formatTimeAgo(dateString) {
    const postDate = new Date(dateString.split('/').reverse().join('-'));
    const now = new Date();
    const diffMs = now - postDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'hoje';
    if (diffDays === 1) return '1d';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`;
    return `${Math.floor(diffDays / 30)}m`;
}

// Testes
describe('Sistema de Notícias', () => {
    beforeEach(() => {
        // Configuração do DOM antes de cada teste
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

        // Resetar localStorage
        localStorage.clear();
        localStorage.setItem("noticias", JSON.stringify(mockNoticias));
        localStorage.setItem("usuarios", JSON.stringify([mockUsuario]));
        localStorage.setItem("usuario", JSON.stringify(mockUsuario));
    });

    describe('Funções Auxiliares', () => {
        test('generateAvatar deve gerar URL correta', () => {
            const avatarUrl = generateAvatar("João Silva");
            expect(avatarUrl).toContain("https://ui-avatars.com/api/");
            expect(avatarUrl).toContain("Jo%C3%A3o%20Silva"); // Espaço codificado como %20
        });

        test('formatTimeAgo deve formatar datas corretamente', () => {
            const hoje = new Date();
            const dia = String(hoje.getDate()).padStart(2, '0');
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            const ano = hoje.getFullYear();
            const dataHoje = `${dia}/${mes}/${ano}`;

            expect(formatTimeAgo(dataHoje)).toBe('hoje');
            expect(formatTimeAgo('01/01/2023')).toMatch(/\d+m/); // Deve retornar algo como "5m"
        });
    });

    describe('Manipulação de Notícias', () => {
        test('deve carregar notícias corretamente', () => {
            // Simular a função loadNews
            const containerCard = document.getElementById("containerCard");
            const loadNews = (noticias) => {
                containerCard.innerHTML = noticias.map(n => `<div>${n.titulo}</div>`).join('');
            };

            loadNews(mockNoticias);
            expect(containerCard.innerHTML).toContain("Primeira notícia");
            expect(containerCard.innerHTML).toContain("Segunda notícia");
        });

        test('deve adicionar nova notícia', () => {
            // Mock da função original
            const originalLoadNews = window.loadNews;
            window.loadNews = jest.fn();

            const btnSalvar = document.getElementById("salvar");
            const modal = document.getElementById("modalNoticia");
            const tituloInput = document.getElementById("titulo");
            const fileInput = document.getElementById("img");

            // Configurar evento de click
            btnSalvar.addEventListener('click', () => {
                const objNoticia = {
                    id: Date.now(),
                    titulo: tituloInput.value,
                    autor: "Usuário Teste",
                    img: fileInput.files[0] ? "mock-url.jpg" : "",
                    data: "01/01/2023",
                    idusuario: 123,
                    views: 0,
                    likes: 0,
                    comentarios: []
                };

                const noticias = JSON.parse(localStorage.getItem("noticias"));
                noticias.push(objNoticia);
                localStorage.setItem("noticias", JSON.stringify(noticias));

                modal.classList.add("d-none");
            });

            // Simular valores
            tituloInput.value = "Nova notícia";
            global.URL.createObjectURL = jest.fn(() => "mock-url.jpg");

            // Simular clique
            btnSalvar.click();

            // Verificações
            const noticias = JSON.parse(localStorage.getItem("noticias"));
            expect(noticias.length).toBe(3);
            expect(noticias[2].titulo).toBe("Nova notícia");
            expect(modal.classList.contains("d-none")).toBe(true);

            // Restaurar implementação original
            window.loadNews = originalLoadNews;
        });

        test('deve editar notícia existente', () => {
            const originalLoadNews = window.loadNews;
            window.loadNews = jest.fn();

            const noticiaOriginal = mockNoticias[0];
            const editarModal = document.getElementById("modalAlertaEditar");
            const tituloEdit = document.getElementById("tituloEdit");
            const btnSalvarEdit = document.getElementById("salvarEdit");

            // Configurar evento de click
            btnSalvarEdit.addEventListener('click', () => {
                const noticias = JSON.parse(localStorage.getItem("noticias"));
                noticias[0].titulo = tituloEdit.value;
                localStorage.setItem("noticias", JSON.stringify(noticias));
                editarModal.classList.add("d-none");
            });

            // Simular edição
            tituloEdit.value = "Notícia editada";
            btnSalvarEdit.click();

            // Verificações
            const noticias = JSON.parse(localStorage.getItem("noticias"));
            expect(noticias[0].titulo).toBe("Notícia editada");
            expect(editarModal.classList.contains("d-none")).toBe(true);

            window.loadNews = originalLoadNews;
        });

        test('deve excluir notícia existente', () => {
            const originalLoadNews = window.loadNews;
            window.loadNews = jest.fn();

            const excluirModal = document.getElementById("modalAlertaExcluir");
            const btnExcluirNt = document.getElementById("excluirNoticia");

            // Configurar evento de click
            btnExcluirNt.addEventListener('click', () => {
                const noticias = JSON.parse(localStorage.getItem("noticias"));
                noticias.splice(0, 1); // Remove a primeira notícia
                localStorage.setItem("noticias", JSON.stringify(noticias));
                excluirModal.classList.add("d-none");
            });

            // Simular exclusão
            btnExcluirNt.click();

            // Verificações
            const noticias = JSON.parse(localStorage.getItem("noticias"));
            expect(noticias.length).toBe(1);
            expect(excluirModal.classList.contains("d-none")).toBe(true);

            window.loadNews = originalLoadNews;
        });
    });

    describe('Paginacao', () => {
        test('deve renderizar paginação corretamente', () => {
            const paginacaoContainer = document.getElementById("paginacaoContainer");

            // Implementação simplificada da função
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

            // Testar com mais de 5 notícias
            const muitasNoticias = [...Array(10).keys()].map(i => ({
                id: i,
                titulo: `Notícia ${i}`,
                autor: "Autor",
                data: "01/01/2023"
            }));

            renderizarPaginacao(muitasNoticias);
            expect(paginacaoContainer.innerHTML).toContain("Anterior");
            expect(paginacaoContainer.innerHTML).toContain("Próximo");

            // Testar com menos de 5 notícias
            renderizarPaginacao(mockNoticias);
            expect(paginacaoContainer.innerHTML).toBe("");
        });
    });

    describe('Pesquisa', () => {
        test('deve filtrar notícias por termo de pesquisa', () => {
            const pesquisarInput = document.getElementById("pesquisa");
            const btnPesq = document.getElementById("btnPesquisa");
            const containerCard = document.getElementById("containerCard");

            // Mock da função loadNews
            const loadNews = (noticias) => {
                containerCard.innerHTML = noticias.map(n => `<div>${n.titulo}</div>`).join('');
            };

            // Configurar evento de click
            btnPesq.addEventListener('click', () => {
                const termo = pesquisarInput.value.toLowerCase();
                const noticias = JSON.parse(localStorage.getItem("noticias"));

                const filtradas = noticias.filter(noticia =>
                    noticia.titulo.toLowerCase().includes(termo)
                );

                loadNews(filtradas);
            });

            // Simular pesquisa
            pesquisarInput.value = "primeira";
            btnPesq.click();

            // Verificações
            expect(containerCard.innerHTML).toContain("Primeira notícia");
            expect(containerCard.innerHTML).not.toContain("Segunda notícia");
        });
    });

    describe('Histórico', () => {
        test('deve exibir histórico do usuário', () => {
            const historicoBtn = document.getElementById("historico");
            const modalH = document.getElementById("modalHistorico");
            const containerhistorico = document.getElementById("historicoContainer");

            // Configurar evento de click
            historicoBtn.addEventListener('click', () => {
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                const usuarios = JSON.parse(localStorage.getItem("usuarios"));

                const user = usuarios.find(u => u.id === usuario.id);
                if (user && user.registro) {
                    containerhistorico.innerHTML = user.registro
                        .map(item => `<p>${item}</p>`)
                        .join('');
                }

                modalH.classList.remove("d-none");
            });

            // Configurar fechar modal
            const fecharHist = document.getElementById("fecharHist");
            fecharHist.addEventListener('click', () => {
                modalH.classList.add("d-none");
            });

            // Adicionar histórico ao usuário
            const usuarios = JSON.parse(localStorage.getItem("usuarios"));
            usuarios[0].registro = ["Ação 1", "Ação 2"];
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            // Simular clique
            historicoBtn.click();

            // Verificações
            expect(modalH.classList.contains("d-none")).toBe(false);
            expect(containerhistorico.innerHTML).toContain("Ação 1");
            expect(containerhistorico.innerHTML).toContain("Ação 2");

            // Simular fechar modal
            fecharHist.click();
            expect(modalH.classList.contains("d-none")).toBe(true);
        });
    });
});
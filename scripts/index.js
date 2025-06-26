let btnSalvar = document.getElementById("salvar");
let containerCard = document.getElementById("containerCard");
let modal = document.getElementById("modalNoticia");
let modalFechar = document.getElementById("fechar");
let editar = document.getElementById("modalAlertaEditar");
let excluir = document.getElementById("modalAlertaExcluir");
let postar = document.getElementById("add-post");

let testusuario = JSON.parse(localStorage.getItem("usuario"));

if (testusuario === null) {
    postar.style.display = "none";
}

let paginaAtual = 1;
let itensPorPagina = 5;

if (localStorage.getItem("usuarios") === null) {
    localStorage.setItem("usuarios", JSON.stringify([]));
}

let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));

postar.addEventListener("click", () => {
    modal.classList.remove("d-none");
    modal.classList.add("d-flex");
})

modalFechar.addEventListener("click", () => {
    modal.classList.remove("d-flex");
    modal.classList.add("d-none");
})

if (localStorage.getItem("noticias") === null) {
    localStorage.setItem("noticias", JSON.stringify([]));
}

let objNoticias = JSON.parse(localStorage.getItem("noticias"));

loadNews(objNoticias);

let fileInput = document.getElementById("img");
let legendaInput = document.getElementById("titulo");

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = file.name.toLowerCase();
        const fileType = file.type;

        const validFormats = ["image/jpeg", "image/jpg", "image/gif", "image/bmp", "image/png"];
        const validExtensions = [".jpg", ".jpeg", ".gif", ".bmp", ".png"];

        const extension = fileName.substring(fileName.lastIndexOf("."));

        if (!validFormats.includes(fileType) && !validExtensions.includes(extension)) {
            alert("Erro: formato de arquivo inválido");
        }
    }
});

btnSalvar.addEventListener("click", () => {
    let tituloValor = document.getElementById("titulo").value;
    let imgFile = fileInput.files[0];

    // Validações do título (mantidas iguais)
    if (!tituloValor || tituloValor.trim() === "") {
        alert('Erro: legenda é obrigatória');
        return;
    } else if (tituloValor.length < 1) {
        alert('Erro: legenda é obrigatória');
        return;
    } else if (tituloValor.length > 3000) {
        alert('Erro: legenda excede limite');
        return;
    }

    // Validação da imagem (se existir)
    if (imgFile) {
        const fileName = imgFile.name.toLowerCase();
        const fileType = imgFile.type;
        
        const validFormats = ["image/jpeg", "image/jpg", "image/gif", "image/bmp", "image/png"];
        const validExtensions = [".jpg", ".jpeg", ".gif", ".bmp", ".png"];
        
        const extension = fileName.substring(fileName.lastIndexOf("."));
        
        if (!validFormats.includes(fileType) || !validExtensions.includes(extension)) {
            alert("Erro: formato de arquivo inválido");
            return;
        }

        // Processa a imagem como Base64
        const reader = new FileReader();
        reader.onload = function(e) {
            saveNewsItem(tituloValor, e.target.result);
        };
        reader.readAsDataURL(imgFile);
    } else {
        // Cria a notícia sem imagem
        saveNewsItem(tituloValor, "");
    }
});

function saveNewsItem(titulo, imgBase64) {
    // Gera dados da notícia
    const data = new Date();
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let ano = data.getFullYear();
    let dataCompleta = `${dia}/${mes}/${ano}`;

    let idUnico = Date.now();

    let objNoticia = {
        id: idUnico,
        titulo: titulo,
        autor: usuario.nome,
        img: imgBase64, // Armazena a imagem como Base64 (ou string vazia)
        data: dataCompleta,
        idusuario: usuario.id,
        views: 0,
        likes: [],
        comentarios: []
    }

    // Adiciona à lista e salva no localStorage
    objNoticias.push(objNoticia);
    localStorage.setItem("noticias", JSON.stringify(objNoticias));

    // Limpa o formulário
    document.getElementById("titulo").value = "";
    fileInput.value = "";

    // Fecha o modal
    modal.classList.remove("d-flex");
    modal.classList.add("d-none");

    // Recarrega as notícias
    loadNews(objNoticias);
    
    alert("Postagem criada com sucesso");
}

// Função para gerar avatar baseado no nome
function generateAvatar(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5E17EB&color=fff&size=40`;
}

// Função para formatar tempo relativo
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

function loadNews(noticias) {
    noticias.sort((a, b) => b.id - a.id);
    containerCard.innerHTML = "";

    let inicio = (paginaAtual - 1) * itensPorPagina;
    let fim = inicio + itensPorPagina;
    let noticiasPaginadas = noticias.slice(inicio, fim);

    for (let noticia of noticiasPaginadas) {
        const autor = getDadosUsuario(noticia.idusuario);
        // Inicializar propriedades se não existirem
        noticia.likes = noticia.likes || [];
        noticia.comentarios = noticia.comentarios || [];

        let card = document.createElement("div");
        card.classList.add('linkedin-post');

        // Header do post (avatar, nome, tempo)
        let postHeader = document.createElement("div");
        postHeader.classList.add('post-header');

        let avatar = document.createElement("img");
        avatar.classList.add('user-avatar');
        avatar.src = autor.fotoperfil || generateAvatar(autor.nome);
        avatar.alt = noticia.autor;

        let userInfo = document.createElement("div");
        userInfo.classList.add('user-info');

        let userName = document.createElement("h6");
        userName.classList.add('user-name');
        userName.textContent = autor.nome;


        let postTime = document.createElement("span");
        postTime.classList.add('post-time');
        postTime.innerHTML = `${formatTimeAgo(noticia.data)} • <i class="fas fa-globe-americas"></i>`;

        let moreOptions = document.createElement("div");
        moreOptions.classList.add('more-options');

        // Adicionar botões de edição/exclusão se for o autor
        if (usuario && usuario.id === noticia.idusuario) {
            let editBtn = document.createElement("i");
            editBtn.classList.add("fas", "fa-edit", "edit-icon");
            editBtn.title = "Editar";

            let deleteBtn = document.createElement("i");
            deleteBtn.classList.add("fas", "fa-trash", "delete-icon");
            deleteBtn.title = "Excluir";

            moreOptions.appendChild(editBtn);
            moreOptions.appendChild(deleteBtn);

            // Event listeners para edição e exclusão
            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                editPost(noticia);
            });

            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                deletePost(noticia);
            });
        } else {
            let moreIcon = document.createElement("i");
            moreIcon.classList.add("fas", "fa-ellipsis-h");
            moreOptions.appendChild(moreIcon);
        }

        // Conteúdo do post
        let postContent = document.createElement("div");
        postContent.classList.add('post-content');

        let postText = document.createElement("p");
        postText.classList.add('post-text');
        postText.textContent = noticia.titulo;

        // Imagem do post (se existir)
        let postImageContainer = document.createElement("div");
        postImageContainer.classList.add('post-image-container');

        if (noticia.img && noticia.img.trim() !== "") {
            let postImage = document.createElement("img");
            postImage.classList.add('post-image');
            postImage.src = noticia.img;
            postImage.alt = noticia.titulo;
            postImageContainer.appendChild(postImage);
        }

        // Estatísticas do post (curtidas, comentários)
        let postStats = document.createElement("div");
        postStats.classList.add('post-stats');

        let likesCount = document.createElement("span");
        likesCount.classList.add('stats-item');
        likesCount.innerHTML = `<i class="fas fa-heart"></i> ${noticia.likes.length} Curtidas`;

        let commentsCount = document.createElement("span");
        commentsCount.classList.add('stats-item');
        commentsCount.innerHTML = `${noticia.comentarios.length} comentários`;

        let viewsCount = document.createElement("span");
        viewsCount.classList.add('stats-item');
        viewsCount.innerHTML = `${noticia.views} visualizações`;

        // Ações do post
        let postActions = document.createElement("div");
        postActions.classList.add('post-actions');

        let likeBtn = document.createElement("button");
        likeBtn.classList.add('action-btn');
        likeBtn.innerHTML = '<i class="far fa-heart"></i> Curtir';

        let commentBtn = document.createElement("button");
        commentBtn.classList.add('action-btn');
        commentBtn.innerHTML = '<i class="far fa-comment"></i> Comentar';

        let shareBtn = document.createElement("button");
        shareBtn.classList.add('action-btn');
        shareBtn.innerHTML = '<i class="far fa-share-square"></i> Compartilhar';

        let sendBtn = document.createElement("button");
        sendBtn.classList.add('action-btn');
        sendBtn.innerHTML = '<i class="far fa-paper-plane"></i> Enviar';

        const jaCurtiu = noticia.likes.includes(usuario.id);

        console.log(jaCurtiu);
    
        if (jaCurtiu) {
            likeBtn.innerHTML = '<i class="fas fa-heart" style="color: #ff3366;"></i> Curtido'
            likeBtn.classList.add("liked")
            likeBtn.disabled = true
        }

        // Event listeners para ações
        likeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (usuario) {
                noticia.likes.push(usuario.id);
                likesCount.innerHTML = `<i class="fas fa-heart"></i> ${noticia.likes.length} Curtidas`;
                likeBtn.innerHTML = '<i class="fas fa-heart" style="color: #ff3366;"></i> Curtido';
                likeBtn.disabled = true;
                localStorage.setItem("noticias", JSON.stringify(objNoticias));
            } else {
                alert("Faça login para curtir");
            }
        });

        commentBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            window.location.href = "noticia.html?id=" + noticia.id;
        });

        shareBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (navigator.share) {
                navigator.share({
                    title: noticia.titulo,
                    text: `Confira esta postagem de ${noticia.autor}`,
                    url: `${window.location.origin}/noticia.html?id=${noticia.id}`
                });
            } else {
                prompt("Copie o link:", `${window.location.origin}/noticia.html?id=${noticia.id}`);
            }
        });

        // Montar estrutura do card
        postHeader.appendChild(avatar);
        userInfo.appendChild(userName);
        userInfo.appendChild(postTime);
        postHeader.appendChild(userInfo);
        postHeader.appendChild(moreOptions);

        postContent.appendChild(postText);
        if (noticia.img && noticia.img.trim() !== "") {
            postContent.appendChild(postImageContainer);
        }

        postStats.appendChild(likesCount);
        postStats.appendChild(commentsCount);
        postStats.appendChild(viewsCount);

        postActions.appendChild(likeBtn);
        postActions.appendChild(commentBtn);
        postActions.appendChild(shareBtn);
        postActions.appendChild(sendBtn);

        card.appendChild(postHeader);
        card.appendChild(postContent);
        card.appendChild(postStats);
        card.appendChild(postActions);

        // Tornar o card clicável (exceto nos botões)
        card.addEventListener("click", (e) => {
            if (!e.target.closest('.action-btn') && !e.target.closest('.more-options')) {
                window.location.href = "noticia.html?id=" + noticia.id;
            }
        });

        containerCard.appendChild(card);
    }

    renderizarPaginacao(noticias);
}

function editPost(noticia) {
    editar.classList.remove("d-none");
    editar.classList.add("d-flex");

    let tituloEdit = document.getElementById("tituloEdit")
    let imgEdit = document.getElementById("imgEdit")

    tituloEdit.value = noticia.titulo;

    let btnCancelar = document.getElementById("cancelarEdit")
    let novoBtnCancelar = btnCancelar.cloneNode(true);
    btnCancelar.replaceWith(novoBtnCancelar);

    novoBtnCancelar.addEventListener("click", () => {
        editar.classList.add("d-none");
        editar.classList.remove("d-flex");
    });

    let btnSalvar = document.getElementById("salvarEdit");
    btnSalvar.replaceWith(btnSalvar.cloneNode(true));
    btnSalvar = document.getElementById("salvarEdit");

    btnSalvar.addEventListener("click", () => {
        if (!tituloEdit.value || tituloEdit.value.trim() === "") {
            alert('Erro: legenda é obrigatória');
            return;
        } else if (tituloEdit.value.length < 1) {
            alert('Erro: legenda é obrigatória');
            return;
        } else if (tituloEdit.value.length > 3000) {
            alert('Erro: legenda excede limite');
            return;
        }

        let imgFile = null;
        if (imgEdit.type === "file" && imgEdit.files.length > 0) {
            imgFile = imgEdit.files[0];
            const fileName = imgFile.name.toLowerCase();
            const fileType = imgFile.type;

            const validFormats = ["image/jpeg", "image/jpg", "image/gif", "image/bmp", "image/png"];
            const validExtensions = [".jpg", ".jpeg", ".gif", ".bmp", ".png"];

            const extension = fileName.substring(fileName.lastIndexOf("."));

            if (!validFormats.includes(fileType) && !validExtensions.includes(extension)) {
                alert("Erro: formato de arquivo inválido");
                return;
            }
        }

        for (let i of objNoticias) {
            if (i.id === noticia.id) {
                i.titulo = tituloEdit.value;
                if (imgFile) {
                    i.img = URL.createObjectURL(imgFile);
                }
                localStorage.setItem("noticias", JSON.stringify(objNoticias));
            }
        }

        loadNews(objNoticias);
        alert("Postagem editada com sucesso");
        editar.classList.add("d-none");
        editar.classList.remove("d-flex");
    })
}

function deletePost(noticia) {

    excluir.classList.remove("d-none");
    excluir.classList.add("d-flex");

    let btnExcluirNt = document.getElementById("excluirNoticia")
    let btnCancelarNt = document.getElementById("cancelarExcluir")

    btnCancelarNt.addEventListener("click", () => {
        excluir.classList.add("d-none")
        excluir.classList.remove("d-flex");
    })

    btnExcluirNt.addEventListener("click", () => {
        for (let i = 0; i < objNoticias.length; i++) {
            if (objNoticias[i].id === noticia.id) {
                objNoticias.splice(i, 1);
                localStorage.setItem("noticias", JSON.stringify(objNoticias));
                loadNews(objNoticias);
                break;
            }
        }
        excluir.classList.add("d-none");
        excluir.classList.remove("d-flex");

    })
}

function renderizarPaginacao(noticias) {
    let totalNoticias = noticias.length;
    let totalPaginas = Math.ceil(totalNoticias / itensPorPagina);

    let paginacaoContainer = document.getElementById("paginacaoContainer");
    paginacaoContainer.innerHTML = "";

    let anterior = document.createElement("button");
    anterior.textContent = "Anterior";
    anterior.classList.add("btn", "btn-primary", "mx-2", "mb-2");
    anterior.disabled = paginaAtual === 1;
    anterior.addEventListener("click", () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            loadNews(noticias);
        }
    });

    let proximo = document.createElement("button");
    proximo.textContent = "Próximo";
    proximo.classList.add("btn", "btn-primary", "mx-2", "mb-2");
    proximo.disabled = paginaAtual === totalPaginas;
    proximo.addEventListener("click", () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            loadNews(noticias);
        }
    });

    if (totalNoticias > 5) {
        paginacaoContainer.appendChild(anterior);
        paginacaoContainer.appendChild(proximo);
    }
}

let pesquisar = document.getElementById('pesquisa');
let btnPesq = document.getElementById("btnPesquisa")

btnPesq.addEventListener('click', (e) => {
    e.preventDefault();

    let input = pesquisar.value.toLowerCase();

    if (input.trim() === "") {
        loadNews(objNoticias);
        return;
    }

    let noticiasFiltradas = objNoticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(input) ||
        (noticia.subtitulo && noticia.subtitulo.toLowerCase().includes(input))
    );

    loadNews(noticiasFiltradas);
});

let historico = document.getElementById("historico")
let modalH = document.getElementById("modalHistorico")
let containerhistorico = document.getElementById("historicoContainer")
historico.addEventListener("click", () => {
    containerhistorico.innerHTML = "";

    if (usuario != null) {
        for (let i = 0; i < objUsuarios.length; i++) {
            if (objUsuarios[i].id === usuario.id) {
                for (let k of objUsuarios[i].registro) {
                    let p = document.createElement("p");
                    p.textContent = k;
                    containerhistorico.appendChild(p);
                }
                break;
            }
        }
    }

    modalH.classList.remove("d-none")
    let botaoHist = document.getElementById("fecharHist")

    botaoHist.addEventListener("click", () => {
        modalH.classList.add('d-none')
    })
})

function getDadosUsuario(idUsuario) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    return usuarios.find(u => u.id === idUsuario) || { nome: "Usuário Desconhecido", fotoperfil: "" };
}
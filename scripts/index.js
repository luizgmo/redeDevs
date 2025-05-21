let btnSalvar = document.getElementById("salvar");
let containerCard = document.getElementById("containerCard");
let url = document.getElementById('img');
let modal = document.getElementById("modalNoticia");
let modalFechar = document.getElementById("fechar");
let editar = document.getElementById("modalAlertaEditar");
let excluir = document.getElementById("modalAlertaExcluir");
let postar = document.getElementById("add-post");

let testusuario = JSON.parse(localStorage.getItem("usuario"));

if (testusuario === null) {
    postar.style.display = "none";
}

let paginaAtual = 1; // Página inicial
let itensPorPagina = 5; // Número de itens por página

if (localStorage.getItem("usuarios") === null) {
    localStorage.setItem("usuarios", JSON.stringify([]));
}

let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));

postar.addEventListener("click", () => {
    modal.classList.remove("d-none");
    modal.classList.add("d-block");
})

modalFechar.addEventListener("click", () => {
    modal.classList.remove("d-block");
    modal.classList.add("d-none");
})

if (localStorage.getItem("noticias") === null) {
    localStorage.setItem("noticias", JSON.stringify([]));
}

let objNoticias = JSON.parse(localStorage.getItem("noticias"));

loadNews(objNoticias);


function mascaraurl(url) {
    let temp = "";
    let start = "https://";

    if (url.startsWith(start.slice(0, url.length))) {
        temp += url;
    } else temp = url.slice(0, url.length - 1);

    return temp;
};

url.addEventListener('input', () => {
    url.value = mascaraurl(url.value);
});

btnSalvar.addEventListener("click", () => {
    let tituloValor = document.getElementById("titulo").value
    let imgValor = document.getElementById("img").value

    if (tituloValor.length < 3) {
        alert('O Titulo deve ter pelo menos 5 caracteres.');
    } else if (imgValor.length < 8) {
        alert('A URL deve ter pelo menos 8 caracteres.');
    } else {

        data = new Date();

        let dia = String(data.getDate()).padStart(2, '0');
        let mes = String(data.getMonth() + 1).padStart(2, '0');
        let ano = data.getFullYear();
        let dataCompleta = `${dia}/${mes}/${ano}`;

        let idUnico = Date.now();

        let objNoticia = {
            id: idUnico,
            titulo: tituloValor,
            autor: usuario.nome,
            img: imgValor,
            data: dataCompleta,
            idusuario: usuario.id,
            views: 0,
            comentarios: []
        }

        objNoticias.push(objNoticia);

        document.getElementById("titulo").value = "";
        document.getElementById("img").value = "";

        localStorage.setItem("noticias", JSON.stringify(objNoticias));

        loadNews(objNoticias);
        modal.classList.add("d-none")
    }
})

function loadNews(noticias) {

    containerCard.innerHTML = "";

    let inicio = (paginaAtual - 1) * itensPorPagina;
    let fim = inicio + itensPorPagina;

    let noticiasPaginadas = noticias.slice(inicio, fim);

    for (let noticia of noticiasPaginadas) {

        let card = document.createElement("div");
        card.classList.add('card', 'cm-card', 'bg-dark', 'rounded', 'shadow-sm');

        let row = document.createElement("div");
        row.classList.add('row', 'g-0');

        let colImg = document.createElement("div");
        colImg.classList.add('col-md-4');

        let img = document.createElement("img");
        img.classList.add("img-fluid", "rounded-start", "w-100", "h-auto", "vh-img")

        let colP = document.createElement("div");
        colP.classList.add('col-md-8');

        let colBody = document.createElement("div");
        colBody.classList.add('card-body');

        let h5 = document.createElement("h5");
        h5.classList.add('titulo-h5', 'text-light');

        let p1 = document.createElement("p");
        p1.classList.add('text-light')
        let p2 = document.createElement("p");
        let small = document.createElement("small");
        small.classList.add('text-secondary');

        let iconsDiv = document.createElement("div");
        iconsDiv.classList.add("icon-section", "ms-auto", "ms-end", "d-flex", "gap-2");

        let editIcon = document.createElement("i");
        editIcon.classList.add("fas", "fa-edit", "text-warning", "cursor-pointer");
        editIcon.title = "Editar";

        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash", "text-danger", "cursor-pointer");
        deleteIcon.title = "Excluir";


        let likeIcon = document.createElement("i");
        likeIcon.classList.add("fa-regular", "fa-heart");
        likeIcon.title = "Like";

        let commentsIcon = document.createElement("i");
        commentsIcon.classList.add("fa-solid", "fa-comment");
        commentsIcon.title = "Comment";

        let shareIcon = document.createElement("i");
        shareIcon.classList.add("fa-solid", "fa-share");
        shareIcon.title = "Share";

        if (usuario === null) {
            editIcon.style.display = "none";
            deleteIcon.style.display = "none";
        }
        else if (usuario.id === noticia.idusuario) {
            editIcon.style.display = "block";
            deleteIcon.style.display = "block";
            shareIcon.style.display = "block";
            commentsIcon.style.display = "block";
            likeIcon.style.display = "block";
        }
        else {
            editIcon.style.display = "none";
            deleteIcon.style.display = "none";
            shareIcon.style.display = "block";
            commentsIcon.style.display = "block";
            likeIcon.style.display = "block";
        }

        editIcon.addEventListener("click", () => {
            let modal = document.getElementById("modalAlertaEditar");
            modal.classList.toggle("d-none");
            document.body.classList.add("modal-active");

            let tituloEdit = document.getElementById("tituloEdit")
            let imgEdit = document.getElementById("imgEdit")

            tituloEdit.value = noticia.titulo;
            imgEdit.value = noticia.img;

            let btnCancelar = document.getElementById("cancelarEdit")
            let novoBtnCancelar = btnCancelar.cloneNode(true);
            btnCancelar.replaceWith(novoBtnCancelar);

            novoBtnCancelar.addEventListener("click", () => {
                modal.classList.add("d-none");
                document.body.classList.remove("modal-active");
            });

            let btnSalvar = document.getElementById("salvarEdit");
            btnSalvar.replaceWith(btnSalvar.cloneNode(true));
            btnSalvar = document.getElementById("salvarEdit");

            btnSalvar.addEventListener("click", () => {
                if (tituloEdit.length < 3) {
                    alert('O Titulo deve ter pelo menos 5 caracteres.');
                } else if (imgEdit.length < 8) {
                    alert('A URL deve ter pelo menos 8 caracteres.');
                } else {
                    for (let i of objNoticias) {
                        if (i.id === noticia.id) {
                            i.titulo = tituloEdit.value;
                            i.img = imgEdit.value;

                            localStorage.setItem("noticias", JSON.stringify(objNoticias));
                        }
                    }

                    modal.classList.toggle("d-none")
                    document.body.classList.remove("modal-active");
                    loadNews(objNoticias);
                }
            })
        });

        deleteIcon.addEventListener("click", () => {
            let modalExcluir = document.getElementById("modalAlertaExcluir")
            modalExcluir.classList.remove("d-none")
            document.body.classList.add("modal-active");
            let btnExcluirNt = document.getElementById("excluirNoticia")
            let btnCancelarNt = document.getElementById("cancelarExcluir")

            btnCancelarNt.addEventListener("click", () => {
                modalExcluir.classList.add("d-none")
                document.body.classList.remove("modal-active");
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
                modalExcluir.classList.add("d-none")
                document.body.classList.remove("modal-active");
            })
        });

        containerCard.appendChild(card);
        card.appendChild(row);
        row.appendChild(colImg);
        colImg.appendChild(img);
        row.appendChild(colP);
        colP.appendChild(colBody);
        colBody.appendChild(h5);
        colBody.appendChild(p1);
        colBody.appendChild(p2);
        p2.appendChild(small);

        colBody.appendChild(iconsDiv);
        iconsDiv.appendChild(editIcon);
        iconsDiv.appendChild(deleteIcon);
        iconsDiv.appendChild(likeIcon);
        iconsDiv.appendChild(commentsIcon);
        iconsDiv.appendChild(shareIcon);

        img.src = noticia.img;
        h5.textContent = noticia.titulo;
        small.textContent = noticia.views + " Views - " + noticia.autor + " - " + noticia.data;

        h5.addEventListener("click", () => {
            window.location.href = "noticia.html?id=" + noticia.id;
        })

        img.addEventListener("click", () => {
            window.location.href = "noticia.html?id=" + noticia.id;
        })
    }

    renderizarPaginacao(noticias);
}


function renderizarPaginacao(noticias) {
    let totalNoticias = noticias.length;
    let totalPaginas = Math.ceil(totalNoticias / itensPorPagina);

    let paginacaoContainer = document.getElementById("paginacaoContainer");
    paginacaoContainer.innerHTML = "";

    let anterior = document.createElement("button");
    anterior.textContent = "Anterior";
    anterior.classList.add("btn", "btn-dark", "mx-2", "mb-2");
    anterior.disabled = paginaAtual === 1;
    anterior.addEventListener("click", () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            loadNews(noticias);
        }
    });


    let proximo = document.createElement("button");
    proximo.textContent = "Próximo";
    proximo.classList.add("btn", "btn-dark", "mx-2", "mb-2");
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
        loadNews();
        return;
    }

    let noticiasFiltradas = objNoticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(input) ||
        noticia.subtitulo.toLowerCase().includes(input)
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



let titulo = document.getElementById("titulo")
let data = document.getElementById("data") ;
let imagem = document.getElementById("imagem");
let nomeAutor = document.getElementById("nomeAutor")
let views = document.getElementById("views")

if(localStorage.getItem("usuarios") === null) {
    localStorage.setItem("usuarios", JSON.stringify([]));
}

let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));


let noticias = JSON.parse(localStorage.getItem("noticias"))

let parame = window.location.search.substring(1);
let valor = parame.split('=');
let id = parseInt(valor[1]);

let noticia = noticias.find(noticia => noticia.id === id)

noticia.views += 1;
localStorage.setItem("noticias", JSON.stringify(noticias));



titulo.textContent = noticia.titulo;
data.textContent = noticia.data;
imagem.src = noticia.img;
nomeAutor.textContent = noticia.autor;

views.textContent = noticia.views;

if(usuario != null) {
    for(let i of objUsuarios) {
        if(i.id === usuario.id) {
            i.registro.push(noticia.titulo);
            localStorage.setItem("usuarios", JSON.stringify(objUsuarios));
            break;
        }
    }
}

document.getElementById('chat-form').addEventListener('submit', function (event) {

    event.preventDefault();

    if(usuario === null) {
        abrirModal();
        return;
    }

    let chatInput = document.getElementById('chat-input');

    if (chatInput.value.trim() !== '') {

        let objMenssagem = {
            nome: usuario.nome,
            mensagem: chatInput.value
        }

        noticia.comentarios.push(objMenssagem);

        localStorage.setItem("noticias", JSON.stringify(noticias));

        chatInput.value = '';

        loadChat();
    }
});

function loadChat() {
    let chatMessages = document.getElementById('chat-messages');

    chatMessages.innerHTML = '';

    for (let comentario of noticia.comentarios) {
        let newMessage = document.createElement('p');
        newMessage.classList.add('t7Tamanho');
        let messageText = document.createTextNode(`${comentario.nome}: ${comentario.mensagem}`);

        newMessage.appendChild(messageText);
        chatMessages.appendChild(newMessage);

    }        
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

loadChat();

function abrirModal() {

    let modal = document.getElementById("modal");

    modal.classList.remove("d-none");
   
    document.getElementById("fechar").addEventListener("click", () => {
        modal.classList.remove("d-block");
        modal.classList.add("d-none");
    });

    document.getElementById("logar").addEventListener("click", () => {
        window.location.href = "login.html";
    });
};






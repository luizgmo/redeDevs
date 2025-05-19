let formLogin = document.getElementById('form-login');


if(localStorage.getItem("usuarios") === null) {
    localStorage.setItem("usuarios", JSON.stringify([]));
}

let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));

let criado = false;

for(let i of objUsuarios) {
    if(i.id === 1){ 
        criado = true;
        break;
    }
}

if(!criado) {

    let objUsuario = {
        id: 1,
        nome: "Cauan Mendes",
        cpf: "333.445.678-42",
        telefone: "(16) 99555-4367",
        email: "cauanmendes@admin.com",
        senha: "123",
        registro: [],
        fotoperfil: "https://voxnews.com.br/wp-content/uploads/2017/04/unnamed.png"
    }
    
    objUsuarios.push(objUsuario);
    
    localStorage.setItem("usuarios", JSON.stringify(objUsuarios));

}

formLogin.addEventListener('submit', function (e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;

    let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));

    let logado = false;

    for(let usuario of objUsuarios) {
        
        if(usuario.email === email && usuario.senha === senha) {
            logado = true;
            localStorage.setItem("usuario", JSON.stringify(usuario));
            document.getElementById("mensagem").textContent = 'Login Bem-Sucedido!'
            setInterval(() => {
                window.location.href = "index.html";
            }, 1500);
        }
    }

    if(logado == false) {
        document.getElementById("mensagem").textContent = 'Email ou senha incorretos.'
    }
});
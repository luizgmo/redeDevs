
// Chamar as funcoes das mascaras 
document.getElementById("nome").addEventListener("input", () => mascaraNome(document.getElementById("nome").value));
document.getElementById("cpf").addEventListener("input", () => mascaraCPF(document.getElementById("cpf").value));
document.getElementById("telefone").addEventListener("input", () => mascaraTelefone(document.getElementById("telefone").value));

document.getElementById("email").addEventListener("blur", () => {
    let erroEmail = mascaraEmail(document.getElementById("email").value);
    document.getElementById("erroEmail").textContent = erroEmail;
});
document.getElementById("senha").addEventListener("blur", () => {
    let erroSenha = mascaraSenha(document.getElementById("senha").value)
    document.getElementById("erroSenha").textContent = erroSenha;
});

if(localStorage.getItem("usuarios") === null) {
    localStorage.setItem("usuarios", JSON.stringify([]));
}

let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));

let idusuario = Date.now();

function mascaraNome(nome) {

    let texto = nome;
    let textoF = "";

    for (let index = 0; index < texto.length; index++) {

        if (isNaN(texto[index]) || texto[index] === " ") {
            textoF += texto[index];
        }
    }

    document.getElementById("nome").value = textoF;

};

function mascaraCPF(cpf) {

    cpf = cpf.trim();
    let temp = "";

    for (let i = 0; i < cpf.length; i++) {
        if (cpf[i] >= '0' && cpf[i] <= '9') {
            temp += cpf[i];
            if (temp.length == 11) break;
        }
    }
    if (temp.length >= 10) {
        temp = temp.slice(0, 3) + '.' + temp.slice(3, 6) + '.' + temp.slice(6, 9) + '-' + temp.slice(9);
    }

    document.getElementById("cpf").value = temp;

};

function mascaraTelefone(tele) {

    let texto = tele;
    let textoF = "";

    for (let i = 0; i < texto.length; i++) {
        if (!isNaN(texto[i]) && texto[i] !== " ") {
            textoF += texto[i];
        }
        if (textoF.length >= 11) {
            break;
        }
    }

    let textoFF = "";

    if (textoF.length > 0) {
        textoFF = "(" + textoF.slice(0, 2);
    }
    if (textoF.length > 2) {
        textoFF += ") " + textoF.slice(2, 7);
    }
    if (textoF.length > 7) {
        textoFF += "-" + textoF.slice(7);
    }

    document.getElementById("telefone").value = textoFF;
};

function mascaraEmail(email) {

    if (email.trim().length == "") {
        return "*Digite um Email"
    }
    let temp = email.split("@");
    if (temp.length < 2) {
        return "Deve ter um @"
    }
    else if (temp.length > 2) {
        return "Deve ter apenas um @"
    }
    else if (temp[0].trim().length == "") {
        return "Sem um endereço de Email do usuário"
    }
    let dominio = temp[1].split(".");
    if (dominio.length < 2) {
        return "Deve ter no mínimo um ."
    }
    else if (dominio[0].trim().length == "") {
        return "Deve haver dominio de Email"
    }
    else if (dominio[1].trim().length == "") {
        return "Deve haver dominio"
    }
    return "";

}

function mascaraSenha(senha) {
    if (senha.trim().length == "") {
        return "*Digite uma senha";
    }
    if (senha.length < 8) {
        return "A senha deve ter pelo menos 8 caracteres";
    }

    let temMaiuscula = false;
    let temMinuscula = false;
    let temNumero = false;
    let temEspecial = false;

    let caracteresEspeciais = "!@#$%^&*(),.?\":{}|<>";

    for (let i = 0; i < senha.length; i++) {
        let char = senha[i];

        if (char >= 'A' && char <= 'Z') {
            temMaiuscula = true;
        } else if (char >= 'a' && char <= 'z') {
            temMinuscula = true;
        } else if (char >= '0' && char <= '9') {
            temNumero = true;
        } else if (caracteresEspeciais.indexOf(char) !== -1) {
            temEspecial = true;
        }
    }

    if (!temMaiuscula) {
        return "A senha deve conter pelo menos uma letra maiúscula";
    }
    if (!temMinuscula) {
        return "A senha deve conter pelo menos uma letra minúscula";
    }
    if (!temNumero) {
        return "A senha deve conter pelo menos um número";
    }
    if (!temEspecial) {
        return "A senha deve conter pelo menos um caractere especial";
    }

    return "";
}

// Validação ao enviar o formulário
document.getElementById("form-cadastro").addEventListener("submit", (e) => {

    e.preventDefault();

    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let telefone = document.getElementById("telefone").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (nome.length < 3) {
        alert("Nome muito curto");
    } else if (telefone.length < 15) {
        alert('Celular incompleto');
    } else if (cpf.length < 14) {
        alert('CPF incompleto');
    } else{

    if (document.getElementById("erroSenha").textContent == "" && document.getElementById("erroEmail").textContent == "") {

        let objUsuario = {
            id: idusuario,
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            email: email,
            senha: senha,
            registro: [],
            fotoperfil: "https://voxnews.com.br/wp-content/uploads/2017/04/unnamed.png"
        }

        objUsuarios.push(objUsuario);

        localStorage.setItem("usuarios", JSON.stringify(objUsuarios));

        document.getElementById("mensagem").textContent = 'Cadastro Bem-Sucedido!'

        document.getElementById("nome").value = "";
        document.getElementById("cpf").value = "";
        document.getElementById("telefone").value = "";
        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";

        setInterval(() => {
            window.location.href = "login.html";
        }, 1000);
    }
}

});


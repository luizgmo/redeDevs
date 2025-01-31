if (localStorage.getItem("usuarios") === null) {
    localStorage.setItem("usuarios", JSON.stringify([]));
}

let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));

let editButton = document.getElementById("editButton");
let cancelButton = document.getElementById("cancelButton");
let editForm = document.getElementById("editForm");
let profileName = document.getElementById("profileName");
let profileEmail = document.getElementById("profileEmail");
let profileTelefone = document.getElementById("profileTelefone")
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let photoInput = document.getElementById("foto");
let telefoneInput = document.getElementById("telefone");
let senhaInput = document.getElementById("senha");
let profilephoto = document.getElementById("fotoperfil");

function mascaraNome(nome) {

    let texto = nome;
    let textoF = "";

    for (let index = 0; index < texto.length; index++) {

        if (isNaN(texto[index]) || texto[index] === " ") {
            textoF += texto[index];
        }
    }

    document.getElementById("name").value = textoF;

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


for (let i of objUsuarios) {

    if (i.id === usuario.id) {

        profileName.textContent = i.nome;
        profileEmail.textContent = i.email;
        profileTelefone.textContent = i.telefone;
        profilephoto.src = i.fotoperfil;

    }
}

editButton.addEventListener("click", () => {
    nameInput.addEventListener("input", () => mascaraNome(nameInput.value));
    telefoneInput.addEventListener("input", () => mascaraTelefone(telefoneInput.value));

    emailInput.addEventListener("blur", () => {
        let erroEmail = mascaraEmail(emailInput.value);
        document.getElementById("erroEmail").textContent = erroEmail;
    });
    senhaInput.addEventListener("blur", () => {
        let erroSenha = mascaraSenha(senhaInput.value)
        document.getElementById("erroSenha").textContent = erroSenha;
    });

    editForm.classList.remove("d-none");
    editButton.classList.add("d-none");


    for (let i of objUsuarios) {
        if (i.id === usuario.id) {

            nameInput.value = i.nome;
            emailInput.value = i.email;
            telefoneInput.value = i.telefone;
            senhaInput.value = i.senha;
        }
    }

});

cancelButton.addEventListener("click", () => {
    editForm.classList.add("d-none");
    editButton.classList.remove("d-none");
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("erroEmail").textContent = mascaraEmail(emailInput.value);
    document.getElementById("erroSenha").textContent = mascaraSenha(senhaInput.value);

    let erroEmail = document.getElementById("erroEmail").textContent;
    let erroSenha = document.getElementById("erroSenha").textContent;

    console.log(nameInput.value);    console.log(telefoneInput.value);


    if (erroEmail !== "" || erroSenha !== "") {
        return;
    }
    if (nameInput.value.length < 3) {
        alert("Nome muito curto");
    } else if (telefoneInput.value.length < 15) {
        alert('Celular incompleto');
    } else {

        for (let i of objUsuarios) {

            if (i.id === usuario.id) {

                i.nome = nameInput.value;
                i.email = emailInput.value;

                i.telefone = telefoneInput.value

                i.senha = senhaInput.value

                if (photoInput.value === "") {
                    i.fotoperfil = i.fotoperfil;
                } else {
                    i.fotoperfil = photoInput.value;
                }


                localStorage.setItem("usuarios", JSON.stringify(objUsuarios));
                document.location.reload(true);

            }

        }

        editForm.classList.add("d-none");
        editButton.classList.remove("d-none");
    }
});

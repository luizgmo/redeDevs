let usuario = JSON.parse(localStorage.getItem("usuario"));
let login = document.getElementById("login");
let logout = document.getElementById("logout");
let perfil = document.getElementById("perfil");

if(usuario === null){
    login.style.display = "block";
    perfil.style.display = "none";
}

if(usuario !== null){
    login.style.display = "none";
    perfil.style.display = "block";
}

logout.addEventListener('click', function() {
    localStorage.removeItem("usuario");
    document.location.reload();
});


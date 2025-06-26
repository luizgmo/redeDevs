/**
 * @jest-environment jsdom
 */

jest.useFakeTimers();

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

const mockUsuarios = [
  {
    id: 1,
    nome: "Cauan Mendes",
    cpf: "333.445.678-42",
    telefone: "(16) 99555-4367",
    email: "cauanmendes@admin.com",
    senha: "123",
    registro: [],
    fotoperfil: "https://voxnews.com.br/wp-content/uploads/2017/04/unnamed.png",
  },
];

describe("Sistema de Login", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="form-login">
        <input id="email" />
        <input id="senha" type="password" />
        <div id="mensagem"></div>
        <button type="submit">Login</button>
      </form>
    `;

    localStorage.clear();
    localStorage.setItem("usuarios", JSON.stringify(mockUsuarios));
  });

  test("deve fazer login com credenciais corretas", () => {
    const formLogin = document.getElementById("form-login");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const mensagemDiv = document.getElementById("mensagem");

    const mockWindowLocation = {
      href: "",
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
    };
    delete window.location;
    window.location = mockWindowLocation;

    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      let email = emailInput.value;
      let senha = senhaInput.value;
      let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));
      let logado = false;

      for (let usuario of objUsuarios) {
        if (usuario.email === email && usuario.senha === senha) {
          logado = true;
          localStorage.setItem("usuario", JSON.stringify(usuario));
          mensagemDiv.textContent = "Login Bem-Sucedido!";

          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        }
      }

      if (!logado) {
        mensagemDiv.textContent = "Email ou senha incorretos.";
      }
    });

    emailInput.value = "cauanmendes@admin.com";
    senhaInput.value = "123";

    formLogin.dispatchEvent(new Event("submit"));

    expect(mensagemDiv.textContent).toBe("Login Bem-Sucedido!");
    expect(JSON.parse(localStorage.getItem("usuario")).email).toBe(
      "cauanmendes@admin.com"
    );

    jest.advanceTimersByTime(1500);
    expect(window.location.href).toBe("http://localhost/");
  });

  test("deve mostrar erro com credenciais incorretas", () => {
    const formLogin = document.getElementById("form-login");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const mensagemDiv = document.getElementById("mensagem");

    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      let email = emailInput.value;
      let senha = senhaInput.value;
      let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));
      let logado = false;

      for (let usuario of objUsuarios) {
        if (usuario.email === email && usuario.senha === senha) {
          logado = true;
        }
      }

      if (!logado) {
        mensagemDiv.textContent = "Email ou senha incorretos.";
      }
    });

    emailInput.value = "email@incorreto.com";
    senhaInput.value = "senhaincorreta";

    formLogin.dispatchEvent(new Event("submit"));

    expect(mensagemDiv.textContent).toBe("Email ou senha incorretos.");
    expect(localStorage.getItem("usuario")).toBeNull();
  });
});

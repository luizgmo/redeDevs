/**
 * @jest-environment jsdom
 */

const mockUsuario = {
  id: 1,
  nome: "Nome Teste",
  email: "teste@example.com",
  telefone: "(11) 98765-4321",
  senha: "Senha@123",
  fotoperfil: "mock-photo.jpg",
};

const mockObjUsuarios = [
  mockUsuario,
  {
    id: 2,
    nome: "Outro Usuário",
    email: "outro@example.com",
    telefone: "(22) 12345-6789",
    senha: "OutraSenha@456",
    fotoperfil: "outro-mock-photo.jpg",
  },
];

beforeAll(() => {
  let localStorageStore = {};
  global.localStorage = {
    getItem: (key) => {
      if (key === 'usuario') return JSON.stringify(mockUsuario);
      if (key === 'usuarios') return JSON.stringify(mockObjUsuarios);
      return localStorageStore[key] || null;
    },
    setItem: (key, value) => {
      localStorageStore[key] = value.toString();
    },
    clear: () => {
      localStorageStore = {};
    }
  };

  delete window.location;
  window.location = {
    reload: jest.fn(),
  };
});

beforeEach(() => {
  document.body.innerHTML = `
    <button id="editButton"></button>
    <button id="cancelButton"></button>
    <form id="editForm" class="d-none"></form>
    <span id="profileName"></span>
    <span id="profileEmail"></span>
    <span id="profileTelefone"></span>
    <input id="name" value="" />
    <input id="email" value="" />
    <input id="img" type="file" />
    <input id="telefone" value="" />
    <input id="senha" value="" />
    <img id="fotoperfil" src="" />
    <span id="erroEmail"></span>
    <span id="erroSenha"></span>
  `;

  localStorage.clear();
  localStorage.setItem("usuarios", JSON.stringify(mockObjUsuarios));
  localStorage.setItem("usuario", JSON.stringify(mockUsuario));
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  delete window.location;
});

function mascaraNome(nome) {
  const input = document.getElementById("name");
  let textoF = "";
  for (let index = 0; index < nome.length; index++) {
    if (isNaN(nome[index]) || nome[index] === " ") {
      textoF += nome[index];
    }
  }
  input.value = textoF;
}

function mascaraTelefone(tele) {
  const input = document.getElementById("telefone");
  let textoF = "";
  for (let i = 0; i < tele.length; i++) {
    if (!isNaN(tele[i]) && tele[i] !== " ") {
      textoF += tele[i];
    }
    if (textoF.length >= 11) break;
  }

  let textoFF = "";
  if (textoF.length > 0) textoFF = "(" + textoF.slice(0, 2);
  if (textoF.length > 2) textoFF += ") " + textoF.slice(2, 7);
  if (textoF.length > 7) textoFF += "-" + textoF.slice(7);

  input.value = textoFF;
}

function mascaraEmail(email) {
  if (email.trim() === "") return "*Digite um Email";
  const temp = email.split("@");
  if (temp.length < 2) return "Deve ter um @";
  if (temp.length > 2) return "Deve ter apenas um @";
  if (temp[0].trim() === "") return "Sem um endereço de Email do usuário";
  
  const dominio = temp[1].split(".");
  if (dominio.length < 2) return "Deve ter no mínimo um .";
  if (dominio[0].trim() === "") return "Deve haver dominio de Email";
  return "";
}

function mascaraSenha(senha) {
  if (senha.trim() === "") return "*Digite uma senha";
  if (senha.length < 8) return "A senha deve ter pelo menos 8 caracteres";

  const hasUpper = /[A-Z]/.test(senha);
  const hasLower = /[a-z]/.test(senha);
  const hasNumber = /[0-9]/.test(senha);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

  if (!hasUpper) return "A senha deve conter pelo menos uma letra maiúscula";
  if (!hasLower) return "A senha deve conter pelo menos uma letra minúscula";
  if (!hasNumber) return "A senha deve conter pelo menos um número";
  if (!hasSpecial) return "A senha deve conter pelo menos um caractere especial";
  return "";
}

describe("perfil.js", () => {
  describe("Funções de Máscara", () => {
    test("mascaraNome deve remover números e manter espaços", () => {
      mascaraNome("Nome123 Teste456");
      expect(document.getElementById("name").value).toBe("Nome Teste");
    });

    test("mascaraTelefone deve formatar o telefone corretamente", () => {
      mascaraTelefone("11987654321");
      expect(document.getElementById("telefone").value).toBe("(11) 98765-4321");
      
      mascaraTelefone("1198765");
      expect(document.getElementById("telefone").value).toBe("(11) 98765");

    });

    test("mascaraEmail deve validar emails corretamente", () => {
      expect(mascaraEmail("")).toBe("*Digite um Email");
      expect(mascaraEmail("teste")).toBe("Deve ter um @");
      expect(mascaraEmail("teste@")).toBe("Deve ter no mínimo um .");
      expect(mascaraEmail("teste@.com")).toBe("Deve haver dominio de Email");
      expect(mascaraEmail("teste@example.com")).toBe("");
    });

    test("mascaraSenha deve validar senhas corretamente", () => {
      expect(mascaraSenha("")).toBe("*Digite uma senha");
      expect(mascaraSenha("abc")).toBe("A senha deve ter pelo menos 8 caracteres");
      expect(mascaraSenha("senhafraca")).toBe("A senha deve conter pelo menos uma letra maiúscula");
      expect(mascaraSenha("SenhaForte@1")).toBe("");
    });
  });

  describe("Interações do DOM", () => {
    test("editButton click deve mostrar o formulário", () => {
      const editButton = document.getElementById("editButton");
      const editForm = document.getElementById("editForm");

      editButton.addEventListener("click", () => {
        editForm.classList.remove("d-none");
        editButton.classList.add("d-none");
      });

      editButton.click();

      expect(editForm.classList.contains("d-none")).toBe(false);
      expect(editButton.classList.contains("d-none")).toBe(true);
    });

    test("cancelButton click deve esconder o formulário", () => {
      const cancelButton = document.getElementById("cancelButton");
      const editForm = document.getElementById("editForm");
      const editButton = document.getElementById("editButton");

      editForm.classList.remove("d-none");
      editButton.classList.add("d-none");

      cancelButton.addEventListener("click", () => {
        editForm.classList.add("d-none");
        editButton.classList.remove("d-none");
      });

      cancelButton.click();

      expect(editForm.classList.contains("d-none")).toBe(true);
      expect(editButton.classList.contains("d-none")).toBe(false);
    });

  });
});
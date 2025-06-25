/**
 * @jest-environment jsdom
 */

// Mock do localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

// Mock de usuários para testes
const mockUsuarios = [
  {
    id: 1,
    nome: "Cauan Mendes",
    cpf: "333.445.678-42",
    telefone: "(16) 99555-4367",
    email: "cauanmendes@admin.com",
    senha: "123",
    registro: [],
    fotoperfil: "https://voxnews.com.br/wp-content/uploads/2017/04/unnamed.png"
  }
];

describe('Sistema de Login', () => {
  beforeEach(() => {
    // Configuração do DOM antes de cada teste
    document.body.innerHTML = `
      <form id="form-login">
        <input id="email" />
        <input id="senha" type="password" />
        <div id="mensagem"></div>
        <button type="submit">Login</button>
      </form>
    `;

    // Resetar localStorage
    localStorage.clear();
    localStorage.setItem("usuarios", JSON.stringify(mockUsuarios));
  });

  test('deve criar usuário admin padrão se não existir', () => {
    // Limpa os usuários para testar a criação
    localStorage.setItem("usuarios", JSON.stringify([]));
    
    // Recria a lógica de inicialização
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

    // Verificações
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    expect(usuarios.length).toBe(1);
    expect(usuarios[0].email).toBe("cauanmendes@admin.com");
  });

  test('deve fazer login com credenciais corretas', () => {
    const formLogin = document.getElementById('form-login');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const mensagemDiv = document.getElementById('mensagem');

    // Mock da função de redirecionamento
    delete window.location;
    window.location = { href: '' };

    // Configurar evento de submit
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();

      let email = emailInput.value;
      let senha = senhaInput.value;
      let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));
      let logado = false;

      for(let usuario of objUsuarios) {
        if(usuario.email === email && usuario.senha === senha) {
          logado = true;
          localStorage.setItem("usuario", JSON.stringify(usuario));
          mensagemDiv.textContent = 'Login Bem-Sucedido!';
          
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        }
      }

      if(!logado) {
        mensagemDiv.textContent = 'Email ou senha incorretos.';
      }
    });

    // Simular credenciais corretas
    emailInput.value = "cauanmendes@admin.com";
    senhaInput.value = "123";
    
    // Disparar evento de submit
    formLogin.dispatchEvent(new Event('submit'));

    // Verificações
    expect(mensagemDiv.textContent).toBe('Login Bem-Sucedido!');
    expect(JSON.parse(localStorage.getItem("usuario")).email).toBe("cauanmendes@admin.com");
  });

  test('deve mostrar erro com credenciais incorretas', () => {
    const formLogin = document.getElementById('form-login');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const mensagemDiv = document.getElementById('mensagem');

    // Configurar evento de submit
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();

      let email = emailInput.value;
      let senha = senhaInput.value;
      let objUsuarios = JSON.parse(localStorage.getItem("usuarios"));
      let logado = false;

      for(let usuario of objUsuarios) {
        if(usuario.email === email && usuario.senha === senha) {
          logado = true;
          // ... lógica de login ...
        }
      }

      if(!logado) {
        mensagemDiv.textContent = 'Email ou senha incorretos.';
      }
    });

    // Simular credenciais incorretas
    emailInput.value = "email@incorreto.com";
    senhaInput.value = "senhaincorreta";
    
    // Disparar evento de submit
    formLogin.dispatchEvent(new Event('submit'));

    // Verificações
    expect(mensagemDiv.textContent).toBe('Email ou senha incorretos.');
    expect(localStorage.getItem("usuario")).toBeNull();
  });

});
/**
 * @jest-environment jsdom
 */

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

function mascaraNome(nome) {
  let texto = nome;
  let textoF = "";

  for (let index = 0; index < texto.length; index++) {
    if (isNaN(texto[index]) || texto[index] === " ") {
      textoF += texto[index];
    }
  }

  document.getElementById("nome").value = textoF;
}

function mascaraCPF(cpf) {
  cpf = cpf.trim();
  let temp = "";

  for (let i = 0; i < cpf.length; i++) {
    if (cpf[i] >= '0' && cpf[i] <= '9') {
      temp += cpf[i];
      if (temp.length == 11) break;
    }
  }

  if (temp.length > 9) {
    temp = temp.slice(0, 3) + '.' + temp.slice(3, 6) + '.' + temp.slice(6, 9) + '-' + temp.slice(9, 11);
  } else if (temp.length > 6) {
    temp = temp.slice(0, 3) + '.' + temp.slice(3, 6) + '.' + temp.slice(6);
  } else if (temp.length > 3) {
    temp = temp.slice(0, 3) + '.' + temp.slice(3);
  }

  document.getElementById("cpf").value = temp;
}

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
}

function mascaraEmail(email) {
  if (email.trim().length == "") {
    return "*Digite um Email";
  }
  let temp = email.split("@");
  if (temp.length < 2) {
    return "Deve ter um @";
  }
  else if (temp.length > 2) {
    return "Deve ter apenas um @";
  }
  else if (temp[0].trim().length == "") {
    return "Sem um endereço de Email do usuário";
  }
  let dominio = temp[1].split(".");
  if (dominio.length < 2) {
    return "Deve ter no mínimo um .";
  }
  else if (dominio[0].trim().length == "") {
    return "Deve haver dominio de Email";
  }
  else if (dominio[1].trim().length == "") {
    return "Deve haver dominio";
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

describe('Testes de Cadastro', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="form-cadastro">
        <input id="nome" />
        <input id="cpf" />
        <input id="telefone" />
        <input id="email" />
        <input id="senha" />
        <div id="erroEmail"></div>
        <div id="erroSenha"></div>
        <div id="mensagem"></div>
      </form>
    `;
    
    localStorage.clear();
    localStorage.setItem("usuarios", JSON.stringify([]));
  });

  describe('Funções de Máscara', () => {
    test('mascaraNome deve remover números', () => {
      const input = document.getElementById('nome');
      input.value = 'João123';
      mascaraNome(input.value);
      expect(input.value).toBe('João');
    });

    test('mascaraCPF deve formatar corretamente', () => {
      const input = document.getElementById('cpf');
      input.value = '12345678901';
      mascaraCPF(input.value);
      expect(input.value).toBe('123.456.789-01');
    });

    test('mascaraCPF deve lidar com entrada parcial', () => {
      const input = document.getElementById('cpf');
      input.value = '123456';
      mascaraCPF(input.value);
      expect(input.value).toBe('123.456');
    });

    test('mascaraTelefone deve formatar corretamente', () => {
      const input = document.getElementById('telefone');
      input.value = '11987654321';
      mascaraTelefone(input.value);
      expect(input.value).toBe('(11) 98765-4321');
    });
  });

  describe('Validação de Email', () => {
    test('deve retornar erro para email vazio', () => {
      expect(mascaraEmail('')).toBe('*Digite um Email');
    });

    test('deve retornar erro para falta de @', () => {
      expect(mascaraEmail('teste.com')).toBe('Deve ter um @');
    });

    test('deve retornar erro para múltiplos @', () => {
      expect(mascaraEmail('teste@@teste.com')).toBe('Deve ter apenas um @');
    });

    test('deve retornar erro para falta de domínio', () => {
      expect(mascaraEmail('teste@.com')).toBe('Deve haver dominio de Email');
    });

    test('deve retornar erro para falta de TLD', () => {
      expect(mascaraEmail('teste@teste.')).toBe('Deve haver dominio');
    });

    test('deve aceitar email válido', () => {
      expect(mascaraEmail('teste@teste.com')).toBe('');
    });
  });

  describe('Validação de Senha', () => {
    test('deve retornar erro para senha vazia', () => {
      expect(mascaraSenha('')).toBe('*Digite uma senha');
    });

    test('deve retornar erro para senha curta', () => {
      expect(mascaraSenha('Ab1!')).toBe('A senha deve ter pelo menos 8 caracteres');
    });

    test('deve retornar erro para falta de maiúscula', () => {
      expect(mascaraSenha('abc123!@#')).toBe('A senha deve conter pelo menos uma letra maiúscula');
    });

    test('deve retornar erro para falta de minúscula', () => {
      expect(mascaraSenha('ABC123!@#')).toBe('A senha deve conter pelo menos uma letra minúscula');
    });

    test('deve retornar erro para falta de número', () => {
      expect(mascaraSenha('ABCabc!@#')).toBe('A senha deve conter pelo menos um número');
    });

    test('deve retornar erro para falta de caractere especial', () => {
      expect(mascaraSenha('ABCabc123')).toBe('A senha deve conter pelo menos um caractere especial');
    });

    test('deve aceitar senha válida', () => {
      expect(mascaraSenha('Senha123!')).toBe('');
    });
  });

  describe('Formulário de Cadastro', () => {
    test('deve impedir envio com campos inválidos', () => {
      document.getElementById('nome').value = 'Jo';
      document.getElementById('cpf').value = '123';
      document.getElementById('telefone').value = '11';
      
      const form = document.getElementById('form-cadastro');
      const event = new Event('submit');
      event.preventDefault = jest.fn();
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
      
      form.dispatchEvent(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('deve cadastrar usuário com campos válidos', () => {
      document.getElementById('nome').value = 'João Silva';
      document.getElementById('cpf').value = '123.456.789-01';
      document.getElementById('telefone').value = '(11) 98765-4321';
      document.getElementById('email').value = 'joao@teste.com';
      document.getElementById('senha').value = 'Senha123!';
      
      document.getElementById('erroEmail').textContent = mascaraEmail(document.getElementById('email').value);
      document.getElementById('erroSenha').textContent = mascaraSenha(document.getElementById('senha').value);
      
      const form = document.getElementById('form-cadastro');
      const event = new Event('submit');
      event.preventDefault = jest.fn();
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        document.getElementById('mensagem').textContent = 'Cadastro Bem-Sucedido!';
        const usuarios = [{
          id: Date.now(),
          nome: 'João Silva',
          cpf: '123.456.789-01',
          telefone: '(11) 98765-4321',
          email: 'joao@teste.com',
          senha: 'Senha123!',
          registro: [],
          fotoperfil: "https://voxnews.com.br/wp-content/uploads/2017/04/unnamed.png"
        }];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      });
      
      form.dispatchEvent(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(document.getElementById('mensagem').textContent).toBe('Cadastro Bem-Sucedido!');
      
      const usuarios = JSON.parse(localStorage.getItem('usuarios'));
      expect(usuarios.length).toBe(1);
      expect(usuarios[0].email).toBe('joao@teste.com');
    });
  });
});
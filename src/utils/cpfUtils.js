//cpfUtils.js
// Função para validar CPF
export function validarCPF(cpf) {

  if (typeof cpf !== 'string') return false;
    // Remover caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');
  
    // Verificar se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;
  
    // Não permitir CPFs com sequências iguais (ex: 111.111.111.11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;
  
    // Validação do primeiro dígito verificador
    let soma = 0;
    let peso = 10;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * peso;
      peso--;
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 === 10 || digito1 === 11) digito1 = 0;
    if (parseInt(cpf.charAt(9)) !== digito1) return false;
  
    // Validação do segundo dígito verificador
    soma = 0;
    peso = 11;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * peso;
      peso--;
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 === 10 || digito2 === 11) digito2 = 0;
    if (parseInt(cpf.charAt(10)) !== digito2) return false;
  
    return true;
  }

  export function normalizarCPF(cpf) {
    return cpf.replace(/[^\d]+/g, '');
  }

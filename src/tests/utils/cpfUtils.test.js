// tests/cpfUtils.test.js
import { normalizarCPF, validarCPF } from '../../utils/cpfUtils.js';

describe('validarCPF', () => {
  it('deve retornar true para CPF válido', () => {
    expect(validarCPF('529.982.247-25')).toBe(true);
    expect(validarCPF('52998224725')).toBe(true);
  });

  it('deve retornar false para CPF inválido', () => {
    expect(validarCPF('123.456.789-00')).toBe(false);
    expect(validarCPF('111.111.111-11')).toBe(false);
    expect(validarCPF('123')).toBe(false);
    expect(validarCPF('')).toBe(false);
    expect(validarCPF(null)).toBe(false);
  });
});

describe('normalizarCPF', () => {
  it('deve remover caracteres não numéricos', () => {
    expect(normalizarCPF('529.982.247-25')).toBe('52998224725');
    expect(normalizarCPF('529-982-247.25')).toBe('52998224725');
  });

  it('deve retornar string vazia se não houver números', () => {
    expect(normalizarCPF('abc')).toBe('');
  });
});

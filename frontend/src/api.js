const BASE = '/api'

async function req(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg || `Erro ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getFuncionarios: (nome = '') =>
    req(`/funcionarios${nome ? `?nome=${encodeURIComponent(nome)}` : ''}`),

  getFuncionario: (id) => req(`/funcionarios/${id}`),

  criarFuncionario: (nome) =>
    req('/funcionarios', { method: 'POST', body: JSON.stringify({ nome }) }),

  adicionarRegistro: (funcionarioId, data) =>
    req(`/funcionarios/${funcionarioId}/registros`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deletarFuncionario: (id) =>
    req(`/funcionarios/${id}`, { method: 'DELETE' }),

  deletarRegistro: (funcionarioId, registroId) =>
    req(`/funcionarios/${funcionarioId}/registros/${registroId}`, { method: 'DELETE' }),

  getResumo: () => req('/resumo'),
}

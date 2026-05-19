import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

function SaldoBadge({ minutos, formatado }) {
  const cls = minutos > 0 ? 'positivo' : minutos < 0 ? 'negativo' : 'zero'
  return <span className={`saldo ${cls}`}>{formatado}</span>
}

function NovoFuncionarioModal({ onClose, onCreated }) {
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) return
    setLoading(true)
    setErro('')
    try {
      await api.criarFuncionario(nome)
      onCreated()
      onClose()
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Novo Funcionário</h3>
        {erro && <div className="error-msg">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome completo</label>
            <input
              autoFocus
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: MARIA SILVA"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-back" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !nome.trim()}>
              {loading ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [funcionarios, setFuncionarios] = useState([])
  const [resumo, setResumo] = useState(null)
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null) // { id, nome }

  async function handleDelete(f, e) {
    e.stopPropagation()
    setConfirmDelete(f)
  }

  async function confirmarDelete() {
    try {
      await api.deletarFuncionario(confirmDelete.id)
      setConfirmDelete(null)
      carregar()
    } catch (err) {
      alert('Erro ao remover: ' + err.message)
    }
  }

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const [lista, res] = await Promise.all([api.getFuncionarios(busca), api.getResumo()])
      setFuncionarios(lista)
      setResumo(res)
    } catch {
      // silencioso — backend pode não estar disponível em dev
    } finally {
      setLoading(false)
    }
  }, [busca])

  useEffect(() => {
    const t = setTimeout(carregar, 300)
    return () => clearTimeout(t)
  }, [carregar])

  return (
    <div className="page">
      <div className="container">

        {resumo && (
          <div className="stats">
            <div className="stat-card total">
              <div className="label">Total de Funcionários</div>
              <div className="value">{resumo.totalFuncionarios}</div>
            </div>
            <div className="stat-card credito">
              <div className="label">Com Crédito</div>
              <div className="value">{resumo.comCredito}</div>
            </div>
            <div className="stat-card debito">
              <div className="label">Com Débito</div>
              <div className="value">{resumo.comDebito}</div>
            </div>
            <div className="stat-card zerado">
              <div className="label">Zerados</div>
              <div className="value">{resumo.zerados}</div>
            </div>
          </div>
        )}

        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Buscar funcionário pelo nome..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Novo Funcionário
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : funcionarios.length === 0 ? (
            <div className="empty"><p>Nenhum funcionário encontrado.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Saldo</th>
                  <th>Registros</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map(f => (
                  <tr
                    key={f.id}
                    className="clickable"
                    onClick={() => navigate(`/funcionario/${f.id}`)}
                  >
                    <td>{f.nome}</td>
                    <td><SaldoBadge minutos={f.saldoMinutos} formatado={f.saldoFormatado} /></td>
                    <td style={{ color: 'var(--text-light)' }}>{f.totalRegistros}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        className="btn btn-ghost"
                        onClick={e => { e.stopPropagation(); navigate(`/funcionario/${f.id}`) }}
                      >
                        Ver →
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ marginLeft: '8px' }}
                        onClick={e => handleDelete(f, e)}
                        title="Remover funcionário"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <NovoFuncionarioModal
          onClose={() => setShowModal(false)}
          onCreated={carregar}
        />
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Remover Funcionário</h3>
            <p style={{ margin: '16px 0' }}>
              Tem certeza que deseja remover <strong>{confirmDelete.nome}</strong>?<br />
              <span style={{ color: 'var(--danger, #e53e3e)', fontSize: '0.9em' }}>
                Todos os registros de banco de horas serão apagados.
              </span>
            </p>
            <div className="form-actions">
              <button className="btn btn-back" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmarDelete}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

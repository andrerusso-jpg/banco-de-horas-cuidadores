import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

/* ── Toast ── */
function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  const icon = type === 'success' ? '✓' : '✕'
  return <div className={`toast ${type}`}><span>{icon}</span>{msg}</div>
}

/* ── Skeleton de carregamento ── */
function SkeletonRows() {
  return (
    <div className="skeleton-wrap">
      {[1,2,3,4,5].map(i => (
        <div className="skeleton-row" key={i}>
          <div className="skeleton sk-name" style={{ width: `${130 + i * 22}px` }} />
          <div className="skeleton sk-badge" />
          <div className="skeleton sk-num" />
          <div className="skeleton sk-btn" />
        </div>
      ))}
    </div>
  )
}

/* ── Badge de saldo ── */
function SaldoBadge({ minutos, formatado }) {
  const cls = minutos > 0 ? 'positivo' : minutos < 0 ? 'negativo' : 'zero'
  return <span className={`saldo ${cls}`}>{formatado}</span>
}

/* ── Modal novo funcionário ── */
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
        <h3>➕ Novo Funcionário</h3>
        {erro && <div className="error-msg">⚠ {erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome completo</label>
            <input
              autoFocus
              value={nome}
              onChange={e => setNome(e.target.value.toUpperCase())}
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

/* ── Modal confirmar exclusão ── */
function ConfirmDeleteModal({ funcionario, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  async function handle() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-danger-icon">🗑️</div>
        <h3>Remover Funcionário</h3>
        <p style={{ color: 'var(--text-light)', marginBottom: 8, lineHeight: 1.6 }}>
          Tem certeza que deseja remover <strong style={{ color: 'var(--text)' }}>{funcionario.nome}</strong>?
        </p>
        <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 500 }}>
          ⚠ Todos os registros de banco de horas serão apagados permanentemente.
        </p>
        <div className="form-actions">
          <button className="btn btn-back" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn btn-danger" onClick={handle} disabled={loading}>
            {loading ? 'Removendo...' : 'Sim, remover'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Dashboard ── */
export default function Dashboard() {
  const navigate = useNavigate()
  const [funcionarios, setFuncionarios] = useState([])
  const [resumo, setResumo] = useState(null)
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
  }

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const [lista, res] = await Promise.all([api.getFuncionarios(busca), api.getResumo()])
      setFuncionarios(lista)
      setResumo(res)
    } catch {
      // silencioso
    } finally {
      setLoading(false)
    }
  }, [busca])

  useEffect(() => {
    const t = setTimeout(carregar, 300)
    return () => clearTimeout(t)
  }, [carregar])

  async function handleDelete() {
    try {
      await api.deletarFuncionario(confirmDelete.id)
      showToast(`${confirmDelete.nome} removido com sucesso.`)
      setConfirmDelete(null)
      carregar()
    } catch (err) {
      showToast('Erro ao remover: ' + err.message, 'error')
      setConfirmDelete(null)
    }
  }

  return (
    <div className="page">
      <div className="container">

        {/* Stats */}
        {resumo && (
          <div className="stats">
            <div className="stat-card total">
              <div className="label">Total</div>
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

        {/* Toolbar */}
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

        {/* Tabela */}
        <div className="card">
          {loading ? (
            <SkeletonRows />
          ) : funcionarios.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">👤</div>
              <p>{busca ? `Nenhum resultado para "${busca}"` : 'Nenhum funcionário cadastrado.'}</p>
            </div>
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
                    <td style={{ fontWeight: 600 }}>{f.nome}</td>
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
                        style={{ marginLeft: 6, padding: '7px 10px' }}
                        onClick={e => { e.stopPropagation(); setConfirmDelete(f) }}
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
          onCreated={() => { carregar(); showToast('Funcionário cadastrado!') }}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          funcionario={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  )
}

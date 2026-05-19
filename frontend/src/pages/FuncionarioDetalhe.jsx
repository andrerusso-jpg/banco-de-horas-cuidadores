import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'

const TIPOS = [
  { value: 'CAPACITACAO_REUNIAO', label: 'Capacitação / Reunião' },
  { value: 'ATESTADO',            label: 'Atestado' },
  { value: 'OUTROS',              label: 'Outros' },
]

/* ── Toast ── */
function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return <div className={`toast ${type}`}><span>{type === 'success' ? '✓' : '✕'}</span>{msg}</div>
}

/* ── Modal de registro ── */
function RegistroModal({ funcionarioId, onClose, onSaved }) {
  const hoje = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    data: hoje,
    tipo: 'CAPACITACAO_REUNIAO',
    horas: 0,
    minutos: 0,
    acontecimento: ''
  })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    try {
      await api.adicionarRegistro(funcionarioId, {
        data: form.data,
        tipo: form.tipo,
        horas: parseInt(form.horas),
        minutos: parseInt(form.minutos),
        acontecimento: form.acontecimento,
      })
      onSaved()
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
        <h3>📋 Adicionar Registro de Horas</h3>
        {erro && <div className="error-msg">⚠ {erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Data</label>
              <input type="date" value={form.data} onChange={e => set('data', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Horas <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(negativo = débito)</span></label>
              <input
                type="number"
                value={form.horas}
                onChange={e => set('horas', e.target.value)}
                placeholder="Ex: 2 ou -2"
              />
            </div>
            <div className="form-group">
              <label>Minutos <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(0–59)</span></label>
              <input
                type="number"
                min="0" max="59"
                value={form.minutos}
                onChange={e => set('minutos', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Descrição / Acontecimento</label>
            <textarea
              rows={3}
              value={form.acontecimento}
              onChange={e => set('acontecimento', e.target.value)}
              placeholder="Descreva o que ocorreu..."
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-back" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Página de detalhe ── */
export default function FuncionarioDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [funcionario, setFuncionario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deletando, setDeletando] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
  }

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      setFuncionario(await api.getFuncionario(id))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { carregar() }, [carregar])

  async function handleDelete(registroId) {
    if (!window.confirm('Remover este registro?')) return
    setDeletando(registroId)
    try {
      await api.deletarRegistro(id, registroId)
      showToast('Registro removido.')
      carregar()
    } catch {
      showToast('Erro ao remover registro.', 'error')
    } finally {
      setDeletando(null)
    }
  }

  if (loading) return (
    <div className="page">
      <div className="container">
        <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-light)' }}>
          Carregando...
        </div>
      </div>
    </div>
  )

  if (!funcionario) return (
    <div className="page">
      <div className="container">
        <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-light)' }}>
          Funcionário não encontrado.
        </div>
      </div>
    </div>
  )

  const saldoCls = funcionario.saldoMinutos > 0 ? 'positivo' : funcionario.saldoMinutos < 0 ? 'negativo' : 'zero'

  return (
    <div className="page">
      <div className="container">

        {/* Header do funcionário */}
        <div className="detail-header">
          <div>
            <button className="btn btn-back" style={{ marginBottom: 14 }} onClick={() => navigate('/')}>
              ← Voltar
            </button>
            <h2>{funcionario.nome}</h2>
            <p style={{ color: 'var(--text-light)', marginTop: 5, fontSize: 13 }}>
              {funcionario.registros.length} registro{funcionario.registros.length !== 1 ? 's' : ''} no histórico
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="saldo-label">Saldo Atual</div>
            <div className={`big-saldo ${saldoCls}`}>{funcionario.saldoFormatado}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Adicionar Registro
          </button>
        </div>

        {/* Tabela de registros */}
        <div className="card">
          {funcionario.registros.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📋</div>
              <p>Nenhum registro ainda. Clique em "Adicionar Registro" para começar.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Horas</th>
                  <th>Descrição</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {funcionario.registros.map(r => (
                  <tr key={r.id} className="registro-row">
                    <td className="td-data">{r.data}</td>
                    <td className="td-horas">
                      <span className={`saldo ${r.totalMinutos >= 0 ? 'positivo' : 'negativo'}`}>
                        {r.horasFormatadas}
                      </span>
                      <span className={`tipo-badge tipo-${r.tipo}`}>{r.tipoDescricao}</span>
                    </td>
                    <td className="td-desc">
                      {r.acontecimento || <span style={{ opacity: .4 }}>—</span>}
                    </td>
                    <td className="td-rem">
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: 13 }}
                        disabled={deletando === r.id}
                        onClick={() => handleDelete(r.id)}
                      >
                        {deletando === r.id ? '...' : '🗑 Remover'}
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
        <RegistroModal
          funcionarioId={id}
          onClose={() => setShowModal(false)}
          onSaved={() => { carregar(); showToast('Registro adicionado!') }}
        />
      )}

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import FuncionarioDetalhe from './pages/FuncionarioDetalhe'

function Header() {
  return (
    <header>
      <div className="container">
        <div className="logo-icon">🕐</div>
        <div>
          <h1>Banco de Horas</h1>
          <span className="subtitle">Gestão de Cuidadores</span>
        </div>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/funcionario/:id" element={<FuncionarioDetalhe />} />
      </Routes>
    </BrowserRouter>
  )
}

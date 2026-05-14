import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import FuncionarioDetalhe from './pages/FuncionarioDetalhe'

function Header() {
  return (
    <header>
      <div className="container">
        <span>🕐</span>
        <h1>Banco de Horas Cuidadores</h1>
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

import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import EditorWorkspace from './pages/EditorWorkspace'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/editor" element={<EditorWorkspace />} />
      </Routes>
    </div>
  )
}

export default App

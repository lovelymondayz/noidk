import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-8 text-center"><h1 className="text-4xl font-bold text-orange-500">🎲 NoIDK</h1><p className="mt-4 text-gray-600">Stop saying "I don't know." We pick. You eat.</p></div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

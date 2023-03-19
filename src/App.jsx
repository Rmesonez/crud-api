
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductList from './components/ProductList'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

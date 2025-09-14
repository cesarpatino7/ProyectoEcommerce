import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './components/Navbar/Navbar.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <div className='w-full max-w-[1000px] mx-auto px-3.5'>
    <Navbar/>
    <App />
    </div>
</BrowserRouter>,
)

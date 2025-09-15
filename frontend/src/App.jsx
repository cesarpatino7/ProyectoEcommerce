import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePages"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import HealthCheck from "./components/Home/HealthCheck"

function App() {
    return (
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/healthcheck" element={<HealthCheck/>} />
      </Routes>
  )
}

export default App

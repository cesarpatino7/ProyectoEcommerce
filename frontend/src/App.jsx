import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePages";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HealthCheck from "./components/Home/HealthCheck";
import Navbar2 from "./components/Navbar/Navbar2";
import CRUDPage from "./pages/CRUDPage.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";

function App() {
  return (
    <>
      <Navbar2 />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/healthcheck" element={<HealthCheck />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
          <Route path="/admin" element={<CRUDPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

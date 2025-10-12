import React from "react";
import Navbar from "./components/Navbar/Navbar"; // Usamos nuestro Navbar refactorizado
import AppRouter from "./routes/AppRouter"; // Importamos nuestro nuevo enrutador

function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <AppRouter />{" "}
        {/* El enrutador se encarga de decidir qué página mostrar */}
      </main>
    </>
  );
}

export default App;

// src/App.jsx

import React from "react";
import Navbar from "./components/Navbar/Navbar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <AppRouter />{" "}
        {/* El enrutador se encarga de decidir qué página mostrar */}
      </main>
    </div>
  );
}

export default App;

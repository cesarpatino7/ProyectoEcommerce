import React, { useEffect, useState } from "react";

function HealthCheck() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/health") // 👈 tu endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
      })
      .then((data) => {
        setStatus(data.status);
      })
      .catch((error) => {
        console.error("Error al consumir el endpoint:", error);
        setStatus("error");
      });
  }, []);

  return (
    <div>
      <h1>Health Check</h1>
      {status ? <p>El servidor está: {status}</p> : <p>Cargando...</p>}
    </div>
  );
}

export default HealthCheck;
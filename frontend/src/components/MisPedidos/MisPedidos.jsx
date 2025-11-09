import React, { useEffect, useState } from "react";
import "./MisPedidos.css";
import { getMisPedidos } from "../../api/pedidoService";

const MisPedidos = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getMisPedidos();
        setOrders(data);
      } catch (err) {
        setError("Error al cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  return (
    <div>
      <h1 className="mis-pedidos-title">Mis Pedidos</h1>
      {loading && <p>Cargando pedidos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div className="order-cards">
          {orders.length === 0 ? (
            <p>No tienes pedidos.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="card w-96 bg-base-100 card-lg shadow-sm"
              >
                <div className="card-body">
                  <h2 className="card-title">
                    {order.title || `Pedido #${order.id}`}
                  </h2>
                  <p>
                    Fecha:{" "}
                    {order.fechaPedido
                      ? new Date(order.fechaPedido).toLocaleString()
                      : "-"}
                  </p>
                  <p>Estado: {order.estado || "-"}</p>
                  <div className="justify-end card-actions">
                    <button
                      className="btn bg-blue-950 text-white hover:bg-blue-900"
                      onClick={() => handleOpenModal(order)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">
              Detalles del Pedido #{selectedOrder.id}
            </h2>
            <div className="space-y-4">
              <p>
                <span className="font-semibold">Fecha:</span>{" "}
                {new Date(selectedOrder.fechaPedido).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{" "}
                {selectedOrder.estado}
              </p>
              <p>
                <span className="font-semibold">Total:</span> $
                {selectedOrder.total.toLocaleString()}
              </p>
              <div>
                <h3 className="font-semibold mb-2">Productos:</h3>
                <ul className="list-disc pl-5">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.nombreProducto} - Cantidad: {item.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="btn bg-blue-950 text-white hover:bg-blue-900" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;

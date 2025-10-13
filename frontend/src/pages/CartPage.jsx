import React from "react";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart();
  const { show } = useNotification();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-semibold">Tu carrito está vacío</h2>
        <p className="text-gray-600 mt-2">Agrega productos desde la tienda.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4">Tu carrito ({totalItems} items)</h1>

      <div className="grid grid-cols-1 gap-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded">
            <img src={item.imagen || item.image} alt={item.nombre || item.name} className="w-24 h-24 object-contain" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.nombre || item.name}</h3>
              <p className="text-gray-600">{new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(item.precio ?? item.price ?? 0)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <input type="number" className="input input-sm w-20 text-center" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} />
              <button className="btn btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <div className="flex flex-col items-end">
              <button className="text-red-600" onClick={() => { removeItem(item.id); show(`Eliminaste ${item.nombre || item.name} del carrito`, 'success'); }}>Eliminar</button>
              <p className="font-semibold mt-2">{new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format((item.precio ?? item.price ?? 0) * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button className="btn btn-ghost" onClick={() => { clearCart(); show('Carrito vaciado', 'success'); }}>Vaciar carrito</button>
        <div className="text-right">
          <p className="text-gray-600">Total:</p>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(totalPrice)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

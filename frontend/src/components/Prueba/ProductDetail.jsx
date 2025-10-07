import { useState } from "react";

const ProductoDetalle = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [notifType, setNotifType] = useState("success"); // 'success' | 'error'
  const [notifMsg, setNotifMsg] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const stock = 99;
  const handleAddToCart = () => {
    if (!cantidad || isNaN(cantidad) || cantidad < 1 || cantidad > stock) {
      setNotifType("error");
      setNotifMsg("Cantidad inválida");
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 2000);
      return;
    }
    setNotifType("success");
    setNotifMsg("¡Producto agregado al carrito con éxito!");
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 2000);
  };
  return (
    <>
      {showNotif && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${notifType === "success" ? "bg-green-500 text-white text-bold border-3 border-green-700" : "bg-red-500 text-white border-2 border-red-700"}`}>
            {notifType === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-semibold">{notifMsg}</span>
          </div>
        </div>
      )}
      <div className="card lg:card-side bg-base-300 border-3 w-full max-w-6xl mx-auto h-auto p-2 sm:p-8 md:p-10">
      <figure className="flex items-center justify-center w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px]
      lg:max-w-[300px] xl:max-w-[340px] h-auto aspect-[3/4] mx-auto bg-white">
        <img
          src="https://ss881.suburbia.com.mx/xl/5011408721.jpg"
          alt="Perfume Lumière Dorée"
          className="object-contain w-full h-full max-h-80 sm:max-h-96"
          style={{ minWidth: '120px', maxWidth: '100%', maxHeight: '380px', background: 'white' }}
        />
      </figure>
      <div className="card-body flex-1 lg:w-auto min-w-0">
        <h2 className="card-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black break-words">
          VERSACE EROS ENERGY EAU DE PARFUM
        </h2>
        <p className="text-gray-600 leading-relaxed text-justify text-xs sm:text-sm md:text-base">
          Es una fragancia vibrante y moderna, diseñada para hombres seguros y apasionados.
          Combina notas frescas y cítricas con un fondo cálido y amaderado,
          creando un aroma que transmite energía, seducción y dinamismo.
        </p>
        <div className="mt-3">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-900">
            $99.99
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Stock disponible: 99 unidades
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 items-center">
          <input
            type="number"
            placeholder="Cantidad"
            min="1"
            max={stock}
            value={cantidad}
            onChange={e => setCantidad(Number(e.target.value))}
            className="input input-bordered w-20 sm:w-28 text-center"
          />
          <button
            className="btn btn-primary w-full sm:w-auto text-white font-bold bg-blue-950"
            onClick={handleAddToCart}
          >
            🛒 Agregar al carrito
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          <div className="badge badge-outline text-shadow-yellow-900">Amaderado</div>
          <div className="badge badge-outline text-blue-600">Masculino</div>
          <div className="badge badge-outline text-gray-600">Eau de Parfum</div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductoDetalle;


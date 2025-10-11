import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductoDetalle = () => {
  const { id } = useParams();
  const [showNotif, setShowNotif] = useState(false);
  const [notifType, setNotifType] = useState("success");
  const [notifMsg, setNotifMsg] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [product, setProduct] = useState(null);
  const stock = 99;

  // Datos de ejemplo - Después los obtendremos del backend
  const products = [
    {
      id: 1,
      name: "VERSACE EROS",
      price: 99.99,
      image: "https://ss881.suburbia.com.mx/xl/5011408721.jpg",
      gender: "masculino",
      brand: "versace",
      description: "Una fragancia seductora y potente para el hombre moderno. Notas de menta, manzana verde y limón italiano."
    },
    {
      id: 2,
      name: "DOLCE & GABBANA LIGHT BLUE",
      price: 85.50,
      image: "https://falabella.scene7.com/is/image/FalabellaPE/882125365_1",
      gender: "femenino",
      brand: "dolce & gabbana",
      description: "Una fragancia fresca y floral que evoca el espíritu del verano mediterráneo. Notas de manzana, campanilla y bambú."
    },
    {
      id: 3,
      name: "CAROLINA HERRERA 212 VIP",
      price: 110.00,
      image: "https://falabella.scene7.com/is/image/FalabellaPE/881952283_1",
      gender: "femenino",
      brand: "carolina herrera",
      description: "Una fragancia elegante y sofisticada. Notas de gardenia, bergamota y almizcle."
    },
    {
      id: 4,
      name: "CHANEL N°5",
      price: 130.00,
      image: "https://odomo.pe/wp-content/uploads/2022/12/CHANEL-N%C2%B05-EAU-DE-PARFUM-SPRAY.webp",
      gender: "femenino",
      brand: "chanel",
      description: "El perfume más icónico del mundo. Una composición floral aldehydica con notas de rosa y jazmín."
    },
    {
      id: 5,
      name: "HUGO BOSS BOTTLED",
      price: 89.99,
      image: "https://falabella.scene7.com/is/image/FalabellaPE/881858070_1",
      gender: "masculino",
      brand: "hugo boss",
      description: "Una fragancia masculina y elegante. Notas de manzana, canela y sándalo."
    },
    {
      id: 6,
      name: "DIOR SAUVAGE",
      price: 120.00,
      image: "https://falabella.scene7.com/is/image/FalabellaPE/882069165_1",
      gender: "masculino",
      brand: "dior",
      description: "Una fragancia fresca y potente. Notas de bergamota, pimienta y ambroxan."
    }
  ];

  useEffect(() => {
    const productId = parseInt(id);
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);
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
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      maximumFractionDigits: 0
    }).format(price * 7300);
  };

  if (!product) {
    return <div className="text-center py-8">Producto no encontrado</div>;
  }

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
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full max-h-80 sm:max-h-96"
          style={{ minWidth: '120px', maxWidth: '100%', maxHeight: '380px', background: 'white' }}
        />
      </figure>
      <div className="card-body flex-1 lg:w-auto min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <h2 className="card-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black break-words">
            {product.name}
          </h2>
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 capitalize">
            {product.gender}
          </span>
        </div>
        <p className="text-xl font-semibold text-gray-700 capitalize mt-2">
          Marca: {product.brand}
        </p>
        <p className="text-gray-600 leading-relaxed text-justify text-xs sm:text-sm md:text-base">
          {product.description}
        </p>
        <div className="mt-3">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-900">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Stock disponible: {stock} unidades
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 items-center">
          <div className="flex items-center">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="text"
              value={cantidad}
              readOnly
              className="input input-bordered w-16 text-center mx-2"
              style={{ appearance: 'textfield' }}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setCantidad(prev => Math.min(stock, prev + 1))}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
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


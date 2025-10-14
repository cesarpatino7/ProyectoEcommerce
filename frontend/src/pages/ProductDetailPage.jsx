import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../api/productService';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

const normalizeProduct = (p) => {
    if (!p) return null;
    // Normalizar distintos nombres de campos que podrían venir del backend o mocks
    return {
        id: p.id ?? p.id_producto ?? p.productId,
        nombre: p.nombre ?? p.name ?? p.title ?? '',
        precio: p.precio ?? p.price ?? p.valor ?? 0,
        imagen: (p.imagenes && p.imagenes[0]) || p.imagen || (p.imagenes && p.imagenes[0]) || '',
        descripcion: p.descripcion ?? p.description ?? p.desc ?? '',
        marca: p.marca ?? p.brand ?? '',
        genero: p.genero ?? p.gender ?? '',
        stockActual: p.stockActual ?? p.stock ?? 0,
    };
};

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const { addItem } = useCart();
    const { show } = useNotification();

    useEffect(() => {
        const load = async () => {
            try {
                const resp = await productService.getProductById(id);
                const normalized = normalizeProduct(resp);
                setProduct(normalized);
            } catch (err) {
                console.error('Error cargando producto', err);
            }
        };
        load();
    }, [id]);

        // Escuchar updates de inventario y actualizar vista si corresponde
        useEffect(() => {
            const onStockUpdated = (ev) => {
                const detail = ev?.detail;
                if (!detail) return;
                // el evento puede traer detail.product o detail.id+stock
                if (detail.product && (detail.product.id === product?.id || detail.product.id == id)) {
                    const normalized = normalizeProduct(detail.product);
                    setProduct(normalized);
                } else if (detail.id && String(detail.id) === String(id)) {
                    // si solo trae id, re-fetch
                    productService.getProductById(id).then(resp => setProduct(normalizeProduct(resp))).catch(() => {});
                }
            };
            window.addEventListener('stockUpdated', onStockUpdated);
            return () => window.removeEventListener('stockUpdated', onStockUpdated);
        }, [id, product]);

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const formatPrice = (price) => new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(price);

    const handleAddToCart = () => {
        if ((product.stockActual ?? 0) <= 0) {
            show('No hay stock disponible', 'error');
            return;
        }
        const quantity = Math.min(Math.max(1, qty), product.stockActual ?? qty);
        addItem({ id: product.id, nombre: product.nombre, precio: product.precio, imagen: product.imagen }, quantity);
        show(`Agregaste ${quantity} × ${product.nombre}`, 'success');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                    <img src={product.imagen} alt={product.nombre} className="w-full h-auto object-contain max-h-[500px]" />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.nombre}</h1>
                    <p className="text-2xl font-bold text-blue-900 mb-4">{formatPrice(product.precio)}</p>

                    <div className="mb-4">
                        <p className="text-gray-600"><span className="font-semibold">Marca:</span> {product.marca}</p>
                        <p className="text-gray-600"><span className="font-semibold">Género:</span> {product.genero}</p>
                        <p className="text-gray-600"><span className="font-semibold">Stock:</span> {product.stockActual ?? 0}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="input input-bordered input-sm w-24" />
                        <button className={`btn ${ (product.stockActual ?? 0) > 0 ? 'btn-primary' : 'btn-disabled' }`} onClick={handleAddToCart}>
                            { (product.stockActual ?? 0) > 0 ? 'Agregar al carrito' : 'Sin stock' }
                        </button>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                        <p className="text-gray-600">{product.descripcion}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../context/AuthContext';
import { ReviewSectionInline } from '../components/ReviewSection';

const normalizeProduct = (p) => {
    if (!p) return null;
    // Normalizar distintos nombres de campos que podrían venir del backend o mocks
    return {
        id: p.id ?? p.id_producto ?? p.productId,
        nombre: p.nombre ?? p.name ?? p.title ?? '',
        precio: p.precio ?? p.price ?? p.valor ?? 0,
        // Manejar varios formatos que pueden venir del backend:
        // - imagenes: array de URLs
        // - imagenes: string JSON '["url1","url2"]'
        // - imagenes: string CSV 'url1,url2'
        // - imagen: string con URL directa
        imagen: (() => {
            try {
                if (Array.isArray(p.imagenes) && p.imagenes.length > 0) return p.imagenes[0];
                if (typeof p.imagenes === 'string' && p.imagenes.trim().length > 0) {
                    const raw = p.imagenes.trim();
                    // intentar parsear JSON
                    if (raw.startsWith('[') || raw.startsWith('{')) {
                        try {
                            const parsed = JSON.parse(raw);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
                            // si no es array, caerá al fallback
                        } catch (e) {
                            // no es JSON válido, seguir intentando
                        }
                    }
                    // intentar CSV
                    if (raw.includes(',')) {
                        const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
                        if (parts.length > 0) return parts[0];
                    }
                    // si es una cadena simple, devolverla (puede ser una URL)
                    return raw;
                }
            } catch (err) {
                console.error('Error procesando campo imagenes:', err);
            }
            return p.imagen ?? '';
        })(),
        descripcion: p.descripcion ?? p.description ?? p.desc ?? '',
        marca: p.marca ?? p.brand ?? '',
        genero: p.genero ?? p.gender ?? '',
        stockActual: p.stockActual ?? p.stock ?? 0,
        // admitir distintas formas: lista de nombres (p.categorias) o ids (p.categoriaIds)
        categorias: p.categorias ?? p.categoriasNombres ?? p.categoriasNames ?? (p.categoriaIds ? p.categoriaIds : []),
    };
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const { addItem } = useCart();
    const { show } = useNotification();
    const { categories } = useCategories();
    const { user } = useAuth();

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
        if (!user) {
            show('Debes iniciar sesión para agregar productos al carrito', 'info');
            navigate("/login");
            return;
        }
        
        if ((product.stockActual ?? 0) <= 0) {
            show('No hay stock disponible', 'error');
            return;
        }
        const quantity = Math.min(Math.max(1, qty), product.stockActual ?? qty);
            // El contexto espera (productId, quantity)
            addItem(product.id, quantity);
        show(`Agregaste ${quantity} × ${product.nombre}`, 'success');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                    <img src={product.imagen} alt={product.nombre} className="w-full h-auto object-contain max-h-[500px]" />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.nombre}</h1>
                    {/* Mostrar categorías como etiquetas/badges */}
                    {(() => {
                        // product.categorias puede ser: array de nombres, string comma-separated, o array de ids
                        const raw = product.categorias;
                        let names = [];
                        if (Array.isArray(raw)) {
                            // si los elementos son strings asumimos nombres
                            if (raw.length === 0) names = [];
                            else if (typeof raw[0] === 'string') names = raw;
                            else if (typeof raw[0] === 'number') {
                                // mapear ids a nombres usando categories (si están disponibles)
                                names = raw.map(id => {
                                    const found = (categories || []).find(c => Number(c.id) === Number(id));
                                    return found ? found.nombre : String(id);
                                });
                            }
                        } else if (typeof raw === 'string' && raw.trim().length > 0) {
                            names = raw.split(',').map(s => s.trim()).filter(Boolean);
                        }

                        return names.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {names.map((c, i) => (
                                    <span key={i} className="badge badge-outline">{c}</span>
                                ))}
                            </div>
                        ) : null;
                    })()}
                    <p className="text-2xl font-bold text-blue-900 mb-4">{formatPrice(product.precio)}</p>

                    <div className="mb-4">
                        <p className="text-gray-600"><span className="font-semibold">Stock:</span> {product.stockActual ?? 0}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <input 
                            type="number" 
                            min="1" 
                            value={qty} 
                            onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} 
                            className="input input-bordered input-sm w-24" 
                            disabled={(product.stockActual ?? 0) <= 0}
                        />
                        {user ? (
                            <button 
                                className={`btn ${ (product.stockActual ?? 0) > 0 ? 'btn-primary' : 'btn-disabled' }`} 
                                onClick={handleAddToCart}
                                disabled={(product.stockActual ?? 0) <= 0}
                            >
                                { (product.stockActual ?? 0) > 0 ? 'Agregar al carrito' : 'Sin stock' }
                            </button>
                        ) : (
                            <button 
                                className="btn btn-primary"
                                onClick={handleAddToCart}
                            >
                                Agregar al carrito
                            </button>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                        <p className="text-gray-600">{product.descripcion}</p>
                    </div>
                </div>
            </div>

            {/* Sección de reseñas */}
            <ReviewSectionInline productId={product.id} />
        </div>
    );
};

export default ProductDetail;
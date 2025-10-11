import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);

    // Simular obtención de datos - Después esto vendrá del backend
    const products = [
        {
            id: 1,
            name: "VERSACE EROS",
            price: 99.99,
            image: "https://ss881.suburbia.com.mx/xl/5011408721.jpg",
            gender: "masculino",
            brand: "versace",
            description: "Versace Eros es una fragancia que encarna la pasión y el deseo. Sus notas principales incluyen menta, manzana verde y limón italiano. El corazón de la fragancia revela haba tonka, ambroxan y geranio, mientras que la base se compone de notas de vainilla, vetiver, musgo de roble y cedro."
        },
        {
            id: 2,
            name: "DOLCE & GABBANA LIGHT BLUE",
            price: 85.50,
            image: "https://falabella.scene7.com/is/image/FalabellaPE/882125365_1",
            gender: "femenino",
            brand: "dolce & gabbana",
            description: "Light Blue es una fragancia fresca y floral que evoca el espíritu del verano mediterráneo. Combina notas de manzana Granny Smith, campanilla y bambú con un corazón de jazmín y rosa blanca, sobre una base de cedro y ámbar."
        },
        {
            id: 3,
            name: "CAROLINA HERRERA 212 VIP",
            price: 110.00,
            image: "https://falabella.scene7.com/is/image/FalabellaPE/881952283_1",
            gender: "femenino",
            brand: "carolina herrera",
            description: "212 VIP es una fragancia que captura la esencia de Nueva York. Combina notas de bergamota y flores con un toque de vainilla y almizcle, creando un aroma elegante y sofisticado perfecto para la noche."
        },
        {
            id: 4,
            name: "CHANEL N°5",
            price: 130.00,
            image: "https://odomo.pe/wp-content/uploads/2022/12/CHANEL-N%C2%B05-EAU-DE-PARFUM-SPRAY.webp",
            gender: "femenino",
            brand: "chanel",
            description: "El legendario Chanel N°5, creado en 1921, es una composición floral aldehydica única. Una mezcla perfecta de rosas de mayo y jazmín de Grasse, con notas de vainilla y sándalo que crean una fragancia intemporal."
        },
        {
            id: 5,
            name: "HUGO BOSS BOTTLED",
            price: 89.99,
            image: "https://falabella.scene7.com/is/image/FalabellaPE/881858070_1",
            gender: "masculino",
            brand: "hugo boss",
            description: "Boss Bottled es una fragancia elegante y moderna que representa al hombre contemporáneo. Combina notas de manzana y canela con un corazón especiado y una base de maderas cálidas y vainilla."
        },
        {
            id: 6,
            name: "DIOR SAUVAGE",
            price: 120.00,
            image: "https://falabella.scene7.com/is/image/FalabellaPE/882069165_1",
            gender: "masculino",
            brand: "dior",
            description: "Sauvage es una fragancia potente y noble. La frescura radical de la bergamota se encuentra con la sensualidad amaderada del ambroxan, creando una composición distintivamente masculina y sofisticada."
        }
    ];

    useEffect(() => {
        const productId = parseInt(id);
        const foundProduct = products.find(p => p.id === productId);
        if (foundProduct) {
            setProduct(foundProduct);
        }

        // Simulación de reseñas
        setReviews([
            {
                id: 1,
                user: "Juan P.",
                rating: 5,
                comment: "Excelente fragancia, dura todo el día.",
                date: "2025-10-01"
            },
            {
                id: 2,
                user: "María S.",
                rating: 4,
                comment: "Muy buena proyección, aunque el precio es un poco alto.",
                date: "2025-09-28"
            }
        ]);
    }, [id]);

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Imagen del producto */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-contain max-h-[500px]"
                    />
                </div>

                {/* Detalles del producto */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                    <p className="text-2xl font-bold text-blue-900 mb-4">${product.price.toFixed(2)}</p>
                    
                    <div className="space-y-4 mb-6">
                        <p className="text-gray-600"><span className="font-semibold">Marca:</span> {product.brand}</p>
                        <p className="text-gray-600"><span className="font-semibold">Género:</span> {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}</p>
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                            <p className="text-gray-600">{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de reseñas */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Reseñas de clientes</h2>
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-semibold">{review.user}</p>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-gray-500 text-sm">{review.date}</span>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
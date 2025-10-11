import { useState, useMemo } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import ProductFilters from '../ProductFilters/ProductFilters';
import SearchBar from '../SearchBar/SearchBar';

const Home = () => {
    const initialFilters = {
        priceRange: [0, 1000000],
        gender: '',
        brand: '',
        searchTerm: ''
    };

    // Datos de ejemplo - Después los obtendremos del backend
    const [products] = useState([
        {
            id: 1,
            name: "VERSACE EROS",
            price: 99.99,
            image: "https://ss881.suburbia.com.mx/xl/5011408721.jpg",
            gender: "masculino",
            brand: "versace"
        },
        {
            id: 2,
            name: "DOLCE & GABBANA LIGHT BLUE",
            price: 85.50,
            image: "https://falabella.scene7.com/is/image/FalabellaPE/882125365_1",
            gender: "femenino",
            brand: "dolce & gabbana"
        },
        {
            id: 3,
            name: "CAROLINA HERRERA 212 VIP",
            price: 110.00,
            image: "https://falabella.scene7.com/is/image/FalabellaPE/881952283_1",
            gender: "femenino",
            brand: "carolina herrera"
        },
        {
            id: 4,
            name: "CHANEL N°5",
            price: 130.00,
            image: "https://odomo.pe/wp-content/uploads/2022/12/CHANEL-N%C2%B05-EAU-DE-PARFUM-SPRAY.webp",
            gender: "femenino",
            brand: "chanel"
        },
        {
            id: 5,
            name: "HUGO BOSS BOTTLED",
            price: 89.99,
            image: "https://falabella.scene7.com/is/image/FalabellaPE/881858070_1",
            gender: "masculino",
            brand: "hugo boss"
        },
        {
            id: 6,
            name: "DIOR SAUVAGE",
            price: 120.00,
            image: "https://falabella.scene7.com/is/image/FalabellaPE/882069165_1",
            gender: "masculino",
            brand: "dior"
        }
    ]);

    const [filters, setFilters] = useState(initialFilters);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Filtro por búsqueda
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const matchesSearch = 
                    product.name.toLowerCase().includes(searchLower) ||
                    product.brand.toLowerCase().includes(searchLower);
                
                if (!matchesSearch) {
                    return false;
                }
            }

            // Filtro por rango de precio
            if (filters.priceRange && Array.isArray(filters.priceRange)) {
                const [min, max] = filters.priceRange;
                const priceInGuaranies = product.price * 7300;
                if (priceInGuaranies < min || priceInGuaranies > max) {
                    return false;
                }
            }

            // Filtro por género
            if (filters.gender && product.gender !== filters.gender) {
                return false;
            }

            // Filtro por marca
            if (filters.brand && product.brand !== filters.brand) {
                return false;
            }

            return true;
        });
    }, [products, filters]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Buscador */}
            <SearchBar 
                onSearch={(term) => handleFilterChange('searchTerm', term)}
            />
            
            {/* Filtros */}
            <ProductFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={() => setFilters(initialFilters)}
            />

            {/* Grilla de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        image={product.image}
                        price={product.price}
                    />
                ))}
            </div>
            
            {/* Mensaje cuando no hay resultados */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600 text-lg">
                        No se encontraron productos que coincidan con los filtros seleccionados
                    </p>
                </div>
            )}
        </div>
    );
}

export default Home;
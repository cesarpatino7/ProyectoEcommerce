import { useState, useEffect, useCallback, useMemo } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductFilters from "../ProductFilters/ProductFilters";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import { useProducts } from "../../hooks/useProducts";

const Home = () => {
  const initialFilters = {
    priceRange: [0, 1000000],
    category: "",
    searchTerm: "",
  };

  const { products, isLoading, error, pageInfo, fetchProducts } = useProducts();
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(0);

  const executeFetch = useCallback(() => {
    const params = {
      page: currentPage,
      size: 12,
      sort: "nombre,asc",
      busqueda: filters.searchTerm || null,
      categoria: filters.category || null,
    };

    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== "")
    );

    fetchProducts(cleanParams);
  }, [filters.searchTerm, filters.category, currentPage, fetchProducts]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      executeFetch();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [executeFetch]);

  const filteredProducts = useMemo(() => {
    const [min, max] = filters.priceRange;

    if (!products || products.length === 0) {
      return [];
    }

    return products.filter((product) => {
      const price = product.precio;
      return price >= min && price <= max;
    });
  }, [products, filters.priceRange]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    if (filterName !== "priceRange") {
      setCurrentPage(0);
    }
  };

  const handleSearch = (term) => {
    handleFilterChange("searchTerm", term);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          Error: {error.message || "No se pudieron cargar los productos."}
        </span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar onSearch={handleSearch} />

      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.nombre}
            image={product.imagen}
            price={product.precio}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-8 col-span-full">
          <p className="text-gray-600 text-lg">
            No se encontraron productos que coincidan con los filtros.
          </p>
        </div>
      )}

      <Pagination
        currentPage={pageInfo.number}
        totalPages={pageInfo.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;

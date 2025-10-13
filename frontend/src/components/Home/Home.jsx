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
  const [mergedProducts, setMergedProducts] = useState(null);
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

  // Escuchar eventos de stock actualizado para recargar lista
  useEffect(() => {
    const onStockUpdated = (ev) => {
      const detail = ev?.detail;
      // If the event carries the full product, try to merge it into current products
      if (detail && detail.product) {
        const prod = detail.product;
        // Merge into products via fetchProducts' internal state by triggering a small local update
        // We cannot directly mutate useProducts' state, so trigger a refetch for current page
        // and also keep an ephemeral insert: store in localStorage a map of freshly updated products
        try {
          const stored = JSON.parse(localStorage.getItem('freshProducts') || '{}');
          stored[prod.id] = prod;
          localStorage.setItem('freshProducts', JSON.stringify(stored));
        } catch (e) {
          // ignore storage errors
        }
        // executeFetch will still refresh the paginated list; we call it to keep consistency
        executeFetch();
        return;
      }

      // Otherwise fallback to a full refetch so server-side pagination can update
      executeFetch();
    };
    window.addEventListener('stockUpdated', onStockUpdated);
    return () => window.removeEventListener('stockUpdated', onStockUpdated);
  }, [executeFetch]);

  // On products update, merge any freshProducts stored in localStorage into the current products array
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('freshProducts') || '{}');
      const keys = Object.keys(stored || {});
      if (!keys.length) return;
      let merged = [...products];
      keys.forEach(k => {
        const fresh = stored[k];
        // if product already exists in current page, replace it
        const idx = merged.findIndex(p => p.id === fresh.id);
        if (idx >= 0) merged[idx] = fresh;
        else merged.unshift(fresh); // insert at start so it's visible
      });
      // Clear the stored freshProducts after merging
      localStorage.removeItem('freshProducts');
      // If fetchProducts provides a setter for products, we'd use it; since products comes from hook,
      // we rely on the hook's next fetch to align; however we can set a temporary state to show merged view
      // To minimally impact, we store merged view in a local state used for rendering.
      setMergedProducts(merged);
    } catch (e) {
      // ignore
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    const [min, max] = filters.priceRange;

    const current = mergedProducts ?? products ?? [];

    if (!current || current.length === 0) {
      return [];
    }

    return current.filter((product) => {
      const price = product.precio;
      return price >= min && price <= max;
    });
  }, [products, mergedProducts, filters.priceRange]);

  // Mostrar sólo productos con stock mayor a 0 en la grilla
  const stockedProducts = useMemo(() => {
    return filteredProducts.filter(p => (p.stockActual ?? p.stock ?? 0) > 0);
  }, [filteredProducts]);

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
        {stockedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.nombre}
            image={product.imagen}
            price={product.precio}
            stock={product.stockActual ?? product.stock}
          />
        ))}
      </div>

      {stockedProducts.length === 0 && !isLoading && (
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

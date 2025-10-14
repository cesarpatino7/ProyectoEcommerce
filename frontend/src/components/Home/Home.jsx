import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductFilters from "../ProductFilters/ProductFilters";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import { useProducts } from "../../hooks/useProducts";
import { productService } from "../../api/productService";

const Home = () => {
  const DEFAULT_MAX_PRICE = 5000000;

  const initialFilters = {
    priceRange: [0, DEFAULT_MAX_PRICE],
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

  const [showAllLoading, setShowAllLoading] = useState(false);
  const fetchedAllRef = useRef(false);

  // Función para obtener todas las páginas de productos y devolver los que tienen stock>0
  const fetchAllStocked = async () => {
    if (showAllLoading) return;
    setShowAllLoading(true);
    try {
      // Primera página para conocer totalPages y size
      const first = await productService.getProducts({ page: 0, size: 50, sort: "nombre,asc" });
      const totalPages = first.totalPages ?? 1;
      const size = first.size ?? 50;
      let all = first.content || [];
      // obtener las páginas restantes
      for (let p = 1; p < totalPages; p++) {
        try {
          const resp = await productService.getProducts({ page: p, size, sort: "nombre,asc" });
          const items = resp.content || [];
          all = all.concat(items);
        } catch (e) {
          console.error('Error fetching page', p, e);
        }
      }

      // Enriquecer con detalle por id para asegurar stockActual
      const enriched = await Promise.all(all.map(async (p) => {
        try {
          const detail = await productService.getProductById(p.id);
          return { ...p, stockActual: detail.stockActual ?? detail.stock ?? p.stock };
        } catch (e) {
          return p;
        }
      }));

      const stocked = enriched.filter(p => (p.stockActual ?? p.stock ?? 0) > 0);
      // mostrar estos productos en la vista (sobrescribe merged view)
      setMergedProducts(stocked);
      fetchedAllRef.current = true;
    } catch (err) {
      console.error('Error fetching all products', err);
    } finally {
      setShowAllLoading(false);
    }
  };

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
        // Additionally, if we've already fetched the full stocked list, merge the product into it
        setMergedProducts(prev => {
          try {
            if (!prev) {
              // If we don't have merged list yet, request full list in background
              fetchAllStocked();
              return prev;
            }
            const idx = prev.findIndex(p => p.id === prod.id);
            // If stock > 0, insert/update; else remove
            if ((prod.stockActual ?? prod.stock ?? 0) > 0) {
              if (idx >= 0) {
                const copy = [...prev]; copy[idx] = prod; return copy;
              } else {
                return [prod, ...prev];
              }
            } else {
              if (idx >= 0) {
                const copy = [...prev]; copy.splice(idx, 1); return copy;
              }
              return prev;
            }
          } catch (e) {
            return prev;
          }
        });
        // executeFetch will still refresh the paginated list if necessary
        executeFetch();
        return;
      }

      // Otherwise fallback to a full refetch so server-side pagination can update
      executeFetch();
    };
    window.addEventListener('stockUpdated', onStockUpdated);
    return () => window.removeEventListener('stockUpdated', onStockUpdated);
  }, [executeFetch]);

  // Al montar, obtener automáticamente todos los productos con stock>0
  useEffect(() => {
    // Si ya obtuvimos todo anteriormente no repetimos
    if (!fetchedAllRef.current) fetchAllStocked();
  }, []);

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

    const searchTerm = (filters.searchTerm || "").trim().toLowerCase();
    const categoryFilter = (filters.category || "").trim().toLowerCase();

    return current.filter((product) => {
      const price = product.precio ?? 0;
      if (price < min || price > max) {
        return false;
      }

      // Filtrado por término de búsqueda (nombre y descripción opcional)
      if (searchTerm) {
        const name = (product.nombre || "").toString().toLowerCase();
        const descripcion = (product.descripcion || "").toString().toLowerCase();
        if (!name.includes(searchTerm) && !descripcion.includes(searchTerm)) {
          return false;
        }
      }

      // Filtrado por categoría si se seleccionó
      if (categoryFilter) {
        // Intentamos varias formas según el shape del objeto producto
        const categoriaNombre = (product.categoria?.nombre || product.categoria || "").toString().toLowerCase();
        if (!categoriaNombre.includes(categoryFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [products, mergedProducts, filters.priceRange, filters.searchTerm, filters.category]);

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

  // No retornamos temprano: mantenemos la barra de búsqueda y filtros montados
  // para que el usuario pueda seguir escribiendo aunque la lista esté cargando o haya un error.

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar onSearch={handleSearch} />

      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        maxPrice={DEFAULT_MAX_PRICE}
      />

      {/* Indicador de carga o error (inline) */}
      {isLoading && (
        <div className="flex justify-center items-center py-6 w-full">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error my-4">
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
      )}

      {/* carga automática de todos los productos con stock>0 al montar */}

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

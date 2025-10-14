import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductFilters from "../ProductFilters/ProductFilters";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import { useProducts } from "../../hooks/useProducts";
import { productService } from "../../api/productService";
import { useCategories } from "../../hooks/useCategories";

const Home = () => {
  const DEFAULT_MAX_PRICE = 5000000;

  const initialFilters = {
    priceRange: [0, DEFAULT_MAX_PRICE],
    category: "",
    searchTerm: "",
  };

  const { products, isLoading, error, pageInfo, fetchProducts } = useProducts();
  const { categories } = useCategories();
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

  const fetchAllStocked = async () => {
    if (showAllLoading) return;
    setShowAllLoading(true);
    try {
      const first = await productService.getProducts({
        page: 0,
        size: 50,
        sort: "nombre,asc",
      });
      const totalPages = first.totalPages ?? 1;
      const size = first.size ?? 50;
      let all = first.content || [];
      for (let p = 1; p < totalPages; p++) {
        try {
          const resp = await productService.getProducts({
            page: p,
            size,
            sort: "nombre,asc",
          });
          const items = resp.content || [];
          all = all.concat(items);
        } catch (e) {
          console.error("Error fetching page", p, e);
        }
      }

      const enriched = await Promise.all(
        all.map(async (p) => {
          try {
            const detail = await productService.getProductById(p.id);
            // Incluir campos de categorías que pueda devolver el detalle para que el filtrado funcione
            return {
              ...p,
              stockActual: detail.stockActual ?? detail.stock ?? p.stock,
              // copiar posibles formatos de categorías desde el detalle
              categoria: detail.categoria ?? p.categoria,
              categorias: detail.categorias ?? detail.categoriaIds ?? p.categorias ?? p.categoriaIds,
              categoriaNombre: detail.categoriaNombre ?? p.categoriaNombre,
            };
          } catch (e) {
            return p;
          }
        })
      );

      const stocked = enriched.filter(
        (p) => (p.stockActual ?? p.stock ?? 0) > 0
      );
      setMergedProducts(stocked);
      fetchedAllRef.current = true;
    } catch (err) {
      console.error("Error fetching all products", err);
    } finally {
      setShowAllLoading(false);
    }
  };

  useEffect(() => {
    const onStockUpdated = (ev) => {
      const detail = ev?.detail;
      if (detail && detail.product) {
        const prod = detail.product;
        try {
          const stored = JSON.parse(
            localStorage.getItem("freshProducts") || "{}"
          );
          stored[prod.id] = prod;
          localStorage.setItem("freshProducts", JSON.stringify(stored));
        } catch (e) {}
        setMergedProducts((prev) => {
          try {
            if (!prev) {
              fetchAllStocked();
              return prev;
            }
            const idx = prev.findIndex((p) => p.id === prod.id);
            if ((prod.stockActual ?? prod.stock ?? 0) > 0) {
              if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = prod;
                return copy;
              } else {
                return [prod, ...prev];
              }
            } else {
              if (idx >= 0) {
                const copy = [...prev];
                copy.splice(idx, 1);
                return copy;
              }
              return prev;
            }
          } catch (e) {
            return prev;
          }
        });
        executeFetch();
        return;
      }

      executeFetch();
    };
    window.addEventListener("stockUpdated", onStockUpdated);
    return () => window.removeEventListener("stockUpdated", onStockUpdated);
  }, [executeFetch]);

  useEffect(() => {
    if (!fetchedAllRef.current) fetchAllStocked();
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("freshProducts") || "{}");
      const keys = Object.keys(stored || {});
      if (!keys.length) return;
      let merged = [...products];
      keys.forEach((k) => {
        const fresh = stored[k];
        const idx = merged.findIndex((p) => p.id === fresh.id);
        if (idx >= 0) merged[idx] = fresh;
        else merged.unshift(fresh);
      });
      localStorage.removeItem("freshProducts");
      setMergedProducts(merged);
    } catch (e) {}
  }, [products]);

  const filteredProducts = useMemo(() => {
    const [min, max] = filters.priceRange;

    const current = mergedProducts ?? products ?? [];

    if (!current || current.length === 0) {
      return [];
    }

    const searchTerm = (filters.searchTerm || "").trim().toLowerCase();
    const normalize = (s) => {
      if (!s && s !== 0) return "";
      return String(s)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\s+/g, " ");
    };

    const categoryFilterRaw = filters.category;
    const categoryFilterList = Array.isArray(categoryFilterRaw)
      ? categoryFilterRaw.map(s => normalize(s)).filter(Boolean)
      : (categoryFilterRaw ? [normalize(categoryFilterRaw)] : []);

    return current.filter((product) => {
      const price = product.precio ?? 0;
      if (price < min || price > max) {
        return false;
      }

      if (searchTerm) {
        const name = (product.nombre || "").toString().toLowerCase();
        const descripcion = (product.descripcion || "")
          .toString()
          .toLowerCase();
        if (!name.includes(searchTerm) && !descripcion.includes(searchTerm)) {
          return false;
        }
      }

      if (categoryFilterList && categoryFilterList.length > 0) {
        // Construir lista de nombres de categorías del producto
        const names = [];
        // 1) product.categoria (objeto o string)
        try {
          if (product.categoria) {
            if (typeof product.categoria === 'object' && product.categoria.nombre) names.push(String(product.categoria.nombre));
            else if (typeof product.categoria === 'string') names.push(String(product.categoria));
          }

          // 2) product.categorias puede ser array de nombres o ids, o string CSV
          if (Array.isArray(product.categorias) && product.categorias.length > 0) {
            if (typeof product.categorias[0] === 'string') {
              names.push(...product.categorias.map(s => String(s)));
            } else {
              // array de ids -> mapear a nombres usando categories
              const mapped = (product.categorias || []).map(id => {
                const found = (categories || []).find(c => Number(c.id) === Number(id));
                return found ? found.nombre : null;
              }).filter(Boolean);
              names.push(...mapped);
            }
          } else if (typeof product.categorias === 'string' && product.categorias.trim().length > 0) {
            names.push(...product.categorias.split(',').map(s => s.trim()).filter(Boolean));
          }

          // 3) fallback otras props
          if (product.categoriaNombre) names.push(String(product.categoriaNombre));
          if (product.categoria_name) names.push(String(product.categoria_name));
        } catch (e) {}

        const lowerNames = names.map(n => normalize(n));
        // si alguna de las categorías seleccionadas coincide (incluir/substr) con lowerNames, mantener el producto
        const anyMatch = categoryFilterList.some(sel => lowerNames.some(n => n.includes(sel)));
        if (!anyMatch) return false;
      }

      return true;
    });
  }, [
    products,
    mergedProducts,
    filters.priceRange,
    filters.searchTerm,
    filters.category,
  ]);

  const stockedProducts = useMemo(() => {
    return filteredProducts.filter((p) => (p.stockActual ?? p.stock ?? 0) > 0);
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

  // DEBUG: imprimir info útil para diagnosticar problemas de filtrado por categoría
  // Elimina o desactiva estos logs cuando confirmemos el problema
  useEffect(() => {
    try {
      const src = mergedProducts ?? products ?? [];
      const sample = (src || []).slice(0, 6).map(p => ({
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        categorias: p.categorias,
        categoriaNombre: p.categoriaNombre,
      }));
      console.debug('[Home] filtroCategoria:', filters.category);
      console.debug('[Home] muestra productos (categorias):', sample);
    } catch (e) {
      console.error('[Home] error al debug log', e);
    }
  }, [filters.category, mergedProducts, products]);

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

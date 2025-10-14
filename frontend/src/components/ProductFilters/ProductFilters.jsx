import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider";
import { useCategories } from "../../hooks/useCategories";

const ProductFilters = ({ filters, onFilterChange, onReset, maxPrice = 5000000 }) => {
  const { categories, isLoading, error } = useCategories();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <button onClick={onReset} className="btn btn-sm btn-outline">
          Limpiar filtros
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriceRangeSlider
          onFilterChange={onFilterChange}
          maxPrice={maxPrice}
          value={filters.priceRange}
        />

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Categoría</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            disabled={isLoading || error}
          >
            <option value="">Todas las categorías</option>
            {isLoading && <option>Cargando...</option>}
            {error && <option>Error al cargar</option>}
            {!isLoading &&
              !error &&
              categories.map((category) => (
                <option key={category.id} value={category.nombre}>
                  {category.nombre}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

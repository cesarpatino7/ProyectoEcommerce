import { useState, useEffect, useCallback, useRef } from 'react';

const PriceRangeSlider = ({ onFilterChange, maxPrice, value }) => {
  const [range, setRange] = useState(() => value || [0, maxPrice]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      maximumFractionDigits: 0
    }).format(price).replace('PYG', 'Gs.');
  }, []);

  useEffect(() => {
    if (value) setRange(value);
  }, [value]);

  const notifyChange = useCallback((newRange) => {
    if (newRange[0] <= newRange[1]) {
      onFilterChange('priceRange', newRange);
    }
  }, [onFilterChange]);

  const handleMinChange = useCallback((e) => {
    const newMin = Math.min(parseInt(e.target.value), range[1]);
    const newRange = [newMin, range[1]];
    setRange(newRange);
    notifyChange(newRange);
  }, [range, notifyChange]);

  const handleMaxChange = useCallback((e) => {
    const newMax = Math.max(parseInt(e.target.value), range[0]);
    const newRange = [range[0], newMax];
    setRange(newRange);
    notifyChange(newRange);
  }, [range, notifyChange]);

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">Rango de Precio</span>
      </label>

      <div className="relative w-full h-8 mt-2">
        {/* Barra de fondo */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-blue-200 rounded-full"></div>

        {/* Barra activa (rango seleccionado) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-700 rounded-full"
          style={{
            left: `${(range[0] / maxPrice) * 100}%`,
            right: `${100 - (range[1] / maxPrice) * 100}%`
          }}
        ></div>

        {/* Control mínimo */}
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={range[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto z-20"
          style={{ WebkitAppearance: 'none' }}
        />

        {/* Control máximo */}
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={range[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto z-10"
          style={{ WebkitAppearance: 'none' }}
        />

        {/* Estilo de los 'thumbs' */}
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: #1d4ed8; /* azul */
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 0 2px rgba(0,0,0,0.4);
            position: relative;
          }
          input[type='range']::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #1d4ed8;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
          }
        `}</style>
      </div>

      <div className="text-center mt-6 text-sm text-gray-600">
        <span>{formatPrice(range[0])} - {formatPrice(range[1])}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;

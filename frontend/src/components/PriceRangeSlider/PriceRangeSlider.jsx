import { useState, useEffect, useCallback } from 'react';

const PriceRangeSlider = ({ onFilterChange, maxPrice = 1000000, value }) => {
    const [range, setRange] = useState(value || [0, maxPrice]);

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
            onFilterChange?.('priceRange', newRange);
        }
    }, [onFilterChange]);

    const handleMinChange = (e) => {
        const newMin = Math.min(Number(e.target.value), range[1] - 1);
        const newRange = [newMin, range[1]];
        setRange(newRange);
        notifyChange(newRange);
    };

    const handleMaxChange = (e) => {
        const newMax = Math.max(Number(e.target.value), range[0] + 1);
        const newRange = [range[0], newMax];
        setRange(newRange);
        notifyChange(newRange);
    };

    return (
        <div className="w-full select-none">
            <label className="block mb-2 font-medium">Rango de Precio</label>

            <div className="relative h-6">
                {/* Línea de fondo */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>

                {/* Línea activa */}
                <div
                    className="absolute top-1/2 h-1 bg-blue-500 rounded-full transform -translate-y-1/2"
                    style={{
                        left: `${(range[0] / maxPrice) * 100}%`,
                        right: `${100 - (range[1] / maxPrice) * 100}%`,
                    }}
                ></div>

                {/* Input rango mínimo */}
                <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={range[0]}
                    onChange={handleMinChange}
                    className="absolute w-full top-0 h-6 appearance-none bg-transparent pointer-events-none"
                    style={{ zIndex: range[0] > maxPrice - 100 ? 5 : 3 }}
                />

                {/* Input rango máximo */}
                <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={range[1]}
                    onChange={handleMaxChange}
                    className="absolute w-full top-0 h-6 appearance-none bg-transparent pointer-events-none"
                />

                {/* Estilos del thumb */}
                <style jsx>{`
                    input[type='range']::-webkit-slider-thumb {
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: #ff0000ff; /* azul Tailwind */
                        cursor: pointer;
                        pointer-events: auto; /* permite moverlos */
                    }
                    input[type='range']::-moz-range-thumb {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: #2563eb;
                        cursor: pointer;
                        pointer-events: auto;
                    }
                `}</style>
            </div>

            <div className="mt-4 text-center text-sm text-gray-700">
                {formatPrice(range[0])} – {formatPrice(range[1])}
            </div>
        </div>
    );
};

export default PriceRangeSlider;

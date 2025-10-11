import { useState, useEffect, useCallback } from 'react';

const PriceRangeSlider = ({ onFilterChange, maxPrice, value }) => {
    // Inicializar el estado con el valor proporcionado o valores por defecto
    const [range, setRange] = useState(() => value || [0, maxPrice]);

    // Formatear precio en guaraníes
    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            maximumFractionDigits: 0
        }).format(price).replace('PYG', 'Gs.');
    }, []);

    // Actualizar el rango cuando cambia el valor externo (reset)
    useEffect(() => {
        if (value) {
            setRange(value);
        }
    }, [value]);

    // Notificar cambios al componente padre
    const notifyChange = useCallback((newRange) => {
        if (newRange[0] <= newRange[1]) {
            onFilterChange('priceRange', newRange);
        }
    }, [onFilterChange]);

    // Manejadores de eventos para los controles deslizables
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
            <div className="relative px-2 pt-2 h-8">
                {/* Barra de fondo */}
                <div className="absolute h-2 left-0 right-0 bg-gray-200 rounded-full"></div>
                
                {/* Barra activa */}
                <div 
                    className="absolute h-2 bg-primary rounded-full" 
                    style={{
                        left: `${(range[0] / maxPrice) * 100}%`,
                        right: `${100 - (range[1] / maxPrice) * 100}%`
                    }}
                ></div>

                {/* Control deslizable mínimo */}
                <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={range[0]}
                    onChange={handleMinChange}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto"
                    style={{
                        '--range-color': 'transparent',
                        '--thumb-color': 'var(--primary)',
                        zIndex: 3
                    }}
                />

                {/* Control deslizable máximo */}
                <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={range[1]}
                    onChange={handleMaxChange}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto"
                    style={{
                        '--range-color': 'transparent',
                        '--thumb-color': 'var(--primary)',
                        zIndex: 2
                    }}
                />
            </div>
            
            {/* Valores */}
            <div className="text-center mt-6 text-sm text-gray-600">
                <span>{formatPrice(range[0])} - {formatPrice(range[1])}</span>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
// src/hooks/useProducts.js

import { useState, useEffect, useCallback } from "react";
import { productService } from "../api/productService";

/**
 * Custom Hook para gestionar la obtención de productos del catálogo.
 * Encapsula la lógica de fetching, estado de carga, errores, y paginación.
 *
 * @returns {object} Un objeto con el estado de los productos y funciones para manipularlo.
 * - products: (Array) La lista de productos de la página actual.
 * - isLoading: (boolean) Verdadero si se está realizando una petición.
 * - error: (object|null) El objeto de error si la petición falla.
 * - pageInfo: (object) Contiene información de la paginación (totalPages, number, etc.).
 * - fetchProducts: (function) La función para ejecutar la carga de productos.
 */
export const useProducts = () => {
  // Estado para almacenar la lista de productos
  const [products, setProducts] = useState([]);

  // Estado para la información de paginación que devuelve el backend
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    number: 0, // La página actual
    size: 12, // Tamaño por defecto
    totalElements: 0,
  });

  // Estado para controlar si se está cargando la información
  const [isLoading, setIsLoading] = useState(true);

  // Estado para almacenar cualquier error que ocurra durante el fetching
  const [error, setError] = useState(null);

  /**
   * Función para obtener los productos.
   * Se envuelve en useCallback para memorizarla y evitar re-creaciones innecesarias
   * si se pasara como dependencia a otros hooks o componentes.
   *
   * @param {object} params - Parámetros de la API como page, size, sort, busqueda, categoria.
   */
  const fetchProducts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      // Usamos el servicio de productos que ya tenemos definido
      const data = await productService.getProducts(params);

      // El backend devuelve un objeto de paginación. Los productos están en 'content'.
      setProducts(data.content || []);

      // Guardamos la información relevante de la paginación
      setPageInfo({
        totalPages: data.totalPages,
        number: data.number,
        size: data.size,
        totalElements: data.totalElements,
      });
    } catch (err) {
      // Si el servicio lanza un error, lo capturamos y lo guardamos en el estado
      setError(err);
      console.error("Error al obtener productos:", err);
    } finally {
      // Aseguramos que el estado de carga siempre se desactive al final
      setIsLoading(false);
    }
  }, []);

  return { products, isLoading, error, pageInfo, fetchProducts };
};

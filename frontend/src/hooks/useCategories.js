import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../api/categoryService";

/**
 * Custom Hook para gestionar la obtención de las categorías de productos.
 *
 * @returns {object} Un objeto con el estado de las categorías.
 * - categories: (Array) La lista de categorías.
 * - isLoading: (boolean) Verdadero si se está realizando una petición.
 * - error: (object|null) El objeto de error si la petición falla.
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err);
      console.error("Error al obtener categorías:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error };
};

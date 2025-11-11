import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../apiClient';
import { getProductReviews, createReview } from '../reviewService';

// Mock del módulo apiClient
vi.mock('../apiClient');

describe('reviewService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProductReviews', () => {
    it('debe retornar las reseñas cuando la petición es exitosa', async () => {
      const mockReviews = [
        { 
          usuario: 'Juan Pérez', 
          calificacion: 5, 
          comentario: 'Excelente producto',
          fechaPublicacion: '2024-01-15'
        },
        { 
          usuario: 'María López', 
          calificacion: 4, 
          comentario: 'Muy bueno',
          fechaPublicacion: '2024-01-16'
        }
      ];

      apiClient.get.mockResolvedValue({ data: mockReviews });

      const result = await getProductReviews(10);

      expect(apiClient.get).toHaveBeenCalledWith('/resenas/10');
      expect(result).toEqual(mockReviews);
      expect(result).toHaveLength(2);
    });

    it('debe lanzar un error cuando la petición falla', async () => {
      const errorMessage = 'Error del servidor';
      apiClient.get.mockRejectedValue({ 
        response: { data: errorMessage } 
      });

      await expect(getProductReviews(1)).rejects.toThrow(errorMessage);
    });

    it('debe lanzar error genérico cuando no hay response.data', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(getProductReviews(1)).rejects.toThrow('Error al obtener las reseñas');
    });
  });

  describe('createReview', () => {
    const reviewPayload = {
      idUsuario: 1,
      idProducto: 10,
      calificacion: 5,
      comentario: 'Excelente fragancia, muy duradera'
    };

    it('debe crear una reseña exitosamente', async () => {
      const mockResponse = { 
        id: 100, 
        ...reviewPayload,
        fechaPublicacion: '2024-01-20'
      };

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await createReview(reviewPayload);

      expect(apiClient.post).toHaveBeenCalledWith('/resenas', reviewPayload);
      expect(result).toEqual(mockResponse);
    });

    it('debe manejar error 409 - reseña duplicada', async () => {
      apiClient.post.mockRejectedValue({ 
        response: { status: 409 } 
      });

      await expect(createReview(reviewPayload)).rejects.toThrow(
        'Ya has publicado una reseña para este producto'
      );
    });

    it('debe manejar error 400 - datos inválidos', async () => {
      apiClient.post.mockRejectedValue({ 
        response: { status: 400 } 
      });

      await expect(createReview(reviewPayload)).rejects.toThrow(
        'Datos de reseña inválidos'
      );
    });

    it('debe manejar error 401 - no autorizado', async () => {
      apiClient.post.mockRejectedValue({ 
        response: { status: 401 } 
      });

      await expect(createReview(reviewPayload)).rejects.toThrow(
        'No tienes permisos para crear una reseña'
      );
    });

    it('debe usar mensaje custom del backend si está disponible', async () => {
      const customMessage = 'El producto no existe';
      apiClient.post.mockRejectedValue({ 
        response: { 
          status: 500,
          data: { message: customMessage } 
        } 
      });

      await expect(createReview(reviewPayload)).rejects.toThrow(customMessage);
    });

    it('debe usar mensaje string del backend si data es string', async () => {
      const customMessage = 'Error personalizado';
      apiClient.post.mockRejectedValue({ 
        response: { 
          status: 500,
          data: customMessage 
        } 
      });

      await expect(createReview(reviewPayload)).rejects.toThrow(customMessage);
    });
  });
});

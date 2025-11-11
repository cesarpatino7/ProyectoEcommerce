import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewSectionInline from '../ReviewSectionInline';
import * as reviewService from '../../../api/reviewService';

// Mocks de contextos
const mockShowNotification = vi.fn();
const mockUser = { id: 1, nombre: 'Juan', apellido: 'Pérez' };

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser })
}));

vi.mock('../../../context/NotificationContext', () => ({
  useNotification: () => ({ show: mockShowNotification })
}));

// Mock del servicio
vi.mock('../../../api/reviewService');

describe('ReviewSectionInline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Carga inicial y visualización', () => {
    it('debe mostrar estado de carga al inicio', () => {
      vi.spyOn(reviewService, 'getProductReviews').mockImplementation(
        () => new Promise(() => {}) // Promise que nunca se resuelve
      );

      render(<ReviewSectionInline productId={10} />);

      expect(screen.getByText(/Cargando reseñas/i)).toBeInTheDocument();
    });

    it('debe mostrar lista de reseñas después de cargar', async () => {
      const mockReviews = [
        {
          usuario: 'Ana López',
          calificacion: 5,
          comentario: 'Excelente perfume',
          fechaPublicacion: '2024-01-10'
        },
        {
          usuario: 'Carlos Ruiz',
          calificacion: 4,
          comentario: 'Muy bueno',
          fechaPublicacion: '2024-01-11'
        }
      ];

      vi.spyOn(reviewService, 'getProductReviews').mockResolvedValue(mockReviews);

      render(<ReviewSectionInline productId={10} />);

      await waitFor(() => {
        expect(screen.getByText('Ana López')).toBeInTheDocument();
      });

      expect(screen.getByText('Excelente perfume')).toBeInTheDocument();
      expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
      expect(screen.getByText('Muy bueno')).toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando no hay reseñas', async () => {
      vi.spyOn(reviewService, 'getProductReviews').mockResolvedValue([]);

      render(<ReviewSectionInline productId={10} />);

      await waitFor(() => {
        expect(screen.getByText(/No hay reseñas para este producto aún/i)).toBeInTheDocument();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe mostrar notificación de error si falla la carga', async () => {
      vi.spyOn(reviewService, 'getProductReviews').mockRejectedValue(
        new Error('Error de red')
      );

      render(<ReviewSectionInline productId={10} />);

      await waitFor(() => {
        expect(mockShowNotification).toHaveBeenCalledWith(
          'Error al cargar las reseñas',
          'error'
        );
      });
    });
  });

  describe('Formulario de nueva reseña', () => {
    beforeEach(() => {
      vi.spyOn(reviewService, 'getProductReviews').mockResolvedValue([]);
    });

    it('debe mostrar botón para escribir reseña si el usuario no ha comentado', async () => {
      render(<ReviewSectionInline productId={10} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Escribir una reseña/i })).toBeInTheDocument();
      });
    });

    it('debe abrir formulario al hacer clic en el botón', async () => {
      render(<ReviewSectionInline productId={10} />);

      const btn = await screen.findByRole('button', { name: /Escribir una reseña/i });
      fireEvent.click(btn);

      expect(screen.getByPlaceholderText(/Escribe tu opinión/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Publicar Reseña/i })).toBeInTheDocument();
    });

    it('debe permitir cambiar la calificación', async () => {
      render(<ReviewSectionInline productId={10} />);

      const btn = await screen.findByRole('button', { name: /Escribir una reseña/i });
      fireEvent.click(btn);

      // Por defecto calificación es 5, buscar estrellas interactivas
      const stars = screen.getAllByRole('button').filter(b => b.textContent === '★');
      
      // Debe haber 5 estrellas seleccionables y otra para publicar
      expect(stars.length).toBeGreaterThanOrEqual(5);
    });

    it('debe deshabilitar botón cuando el comentario es muy corto', async () => {
      render(<ReviewSectionInline productId={10} />);

      const btn = await screen.findByRole('button', { name: /Escribir una reseña/i });
      fireEvent.click(btn);

      const textarea = screen.getByPlaceholderText(/Escribe tu opinión/i);
      fireEvent.change(textarea, { target: { value: 'Corto' } });

      const submitBtn = screen.getByRole('button', { name: /Publicar Reseña/i });
      
      // El botón debe estar deshabilitado cuando el texto es menor a 10 caracteres
      expect(submitBtn).toBeDisabled();
    });

    it('debe enviar la reseña cuando es válida', async () => {
      vi.spyOn(reviewService, 'createReview').mockResolvedValue({ id: 999 });

      render(<ReviewSectionInline productId={10} />);

      const btn = await screen.findByRole('button', { name: /Escribir una reseña/i });
      fireEvent.click(btn);

      const textarea = screen.getByPlaceholderText(/Escribe tu opinión/i);
      fireEvent.change(textarea, { target: { value: 'Este perfume es excelente, muy recomendado' } });

      const submitBtn = screen.getByRole('button', { name: /Publicar Reseña/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(reviewService.createReview).toHaveBeenCalledWith(
          expect.objectContaining({
            idUsuario: 1,
            idProducto: 10,
            calificacion: 5,
            comentario: 'Este perfume es excelente, muy recomendado'
          })
        );
      });

      expect(mockShowNotification).toHaveBeenCalledWith(
        'Reseña publicada exitosamente',
        'success'
      );
    });

    it('debe cerrar el formulario al cancelar', async () => {
      render(<ReviewSectionInline productId={10} />);

      const btn = await screen.findByRole('button', { name: /Escribir una reseña/i });
      fireEvent.click(btn);

      const cancelBtn = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(cancelBtn);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Escribe tu opinión/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Usuario que ya reseñó', () => {
    it('debe mostrar mensaje si el usuario ya dejó reseña', async () => {
      const mockReviews = [
        {
          usuario: 'Juan Pérez', // Mismo nombre que mockUser
          calificacion: 5,
          comentario: 'Ya comenté antes',
          fechaPublicacion: '2024-01-10'
        }
      ];

      vi.spyOn(reviewService, 'getProductReviews').mockResolvedValue(mockReviews);

      render(<ReviewSectionInline productId={10} />);

      await waitFor(() => {
        expect(screen.getByText(/Ya has publicado una reseña para este producto/i)).toBeInTheDocument();
      });

      // No debe mostrar el botón para escribir
      expect(screen.queryByRole('button', { name: /Escribir una reseña/i })).not.toBeInTheDocument();
    });
  });
});

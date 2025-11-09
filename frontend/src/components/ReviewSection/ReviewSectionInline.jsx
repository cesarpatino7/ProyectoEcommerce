import { useState, useEffect } from 'react';
import { getProductReviews, createReview } from '../../api/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const ReviewSectionInline = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    calificacion: 5,
    comentario: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { show: showNotification } = useNotification();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      // Solo mostrar error si el usuario está logueado
      if (user) {
        showNotification('Error al cargar las reseñas', 'error');
      }
      // Para usuarios no logueados o errores, mostrar lista vacía sin error
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showNotification('Debes iniciar sesión para escribir una reseña', 'error');
      return;
    }

    if (formData.comentario.trim().length < 10) {
      showNotification('El comentario debe tener al menos 10 caracteres', 'error');
      return;
    }

    const reviewPayload = {
      idUsuario: user.id,
      idProducto: parseInt(productId),
      calificacion: formData.calificacion,
      comentario: formData.comentario
    };

    try {
      setSubmitting(true);
      await createReview(reviewPayload);
      
      showNotification('Reseña publicada exitosamente', 'success');
      setFormData({ calificacion: 5, comentario: '' });
      setShowForm(false);
      fetchReviews(); // Recargar reseñas
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const renderStarSelector = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setFormData({ ...formData, calificacion: index + 1 })}
        className={`text-2xl ${
          index < formData.calificacion ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 transition-colors`}
      >
        ★
      </button>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Verificar si el usuario actual ya ha hecho una reseña
  const userHasReviewed = user && reviews.some(review => {
    // Comparar por nombre completo del usuario (normalizando espacios)
    const currentUserName = `${user.nombre || ''} ${user.apellido || ''}`.trim().replace(/\s+/g, ' ');
    const reviewUserName = (review.usuario || '').trim().replace(/\s+/g, ' ');
    return reviewUserName === currentUserName;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reseñas de usuarios</h2>

      {/* Botón para agregar reseña o mensaje si ya comentó */}
      {user && (
        <div className="mb-6">
          {userHasReviewed ? (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <p className="text-blue-800 font-medium">
                  Ya has publicado una reseña para este producto
                </p>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Gracias por compartir tu opinión con otros usuarios
              </p>
            </div>
          ) : !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn bg-blue-950 text-white hover:bg-blue-900"
            >
              ✍️ Escribir una reseña
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nueva Reseña</h3>
              
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Calificación:
                  </label>
                  <div className="flex gap-1">
                    {renderStarSelector()}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Comentario:
                  </label>
                  <textarea
                    value={formData.comentario}
                    onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder="Escribe tu opinión sobre este producto..."
                    required
                    minLength={10}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Mínimo 10 caracteres ({formData.comentario.length}/10)
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting || formData.comentario.trim().length < 10}
                    className={`btn ${submitting || formData.comentario.trim().length < 10 ? 'btn-disabled' : 'bg-blue-950 text-white hover:bg-blue-900'}`}
                  >
                    {submitting ? 'Publicando...' : 'Publicar Reseña'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Lista de reseñas */}
      {loading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2">Cargando reseñas...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay reseñas para este producto aún.</p>
          {!user && (
            <p className="mt-2 text-sm">
              <a href="/login" className="text-blue-600 hover:underline">
                Inicia sesión
              </a> para escribir la primera reseña.
            </p>
          )}
        </div>
      ) : (
        <ul className="list bg-base-100 rounded-box shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            Reseñas de usuarios ({reviews.length})
          </li>
          {reviews.map((review, index) => (
            <li key={index} className="list-row">
              <div>
                <div className="font-semibold">{review.usuario}</div>
                <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-2">
                  <div className="flex">
                    {renderStars(review.calificacion)}
                  </div>
                  <span>{formatDate(review.fechaPublicacion)}</span>
                </div>
              </div>
              <p className="list-col-wrap text-sm">
                {review.comentario}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewSectionInline;
import React, { useState, useEffect } from 'react';
import { adminProductService } from '../api/adminProductService';
import { useNotification } from '../context/NotificationContext';
import { useCategories } from '../hooks/useCategories';

const AdminAddProduct = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // limpiar objectURL cuando cambie previewUrl o al desmontar
    return () => {
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
      }
    };
  }, [previewUrl]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { show } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const precioNum = Number(precio);
      if (Number.isNaN(precioNum) || precioNum < 0) {
        show('El precio debe ser un número mayor o igual a 0', 'error');
        setIsSubmitting(false);
        return;
      }

      let imagenUrl = null;
      if (imagenFile) {
        imagenUrl = await adminProductService.uploadImage(imagenFile);
      }

      const dto = {
        nombre,
        descripcion,
        precio: Number(precio),
        activo: true,
        categoriaIds: selectedCategoryIds,
        imagenes: imagenUrl ? [imagenUrl] : []
      };

      await adminProductService.createProduct(dto);
      show('Producto creado correctamente', 'success');
      setNombre(''); setDescripcion(''); setPrecio(''); setImagenFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      show('Error al crear el producto (ver consola)', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Agregar Producto </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="input w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="textarea w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Precio (PYG)</label>
          <input value={precio} onChange={e => setPrecio(e.target.value)} className="input w-full" type="number" min="0" step="1" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Imagen</label>
          <input id="admin-add-file" type="file" accept="image/*" className="hidden" onChange={e => {
            const f = e.target.files[0];
            setImagenFile(f);
            if (f) {
              const url = URL.createObjectURL(f);
              setPreviewUrl(url);
            } else {
              setPreviewUrl(null);
            }
          }} />
          <label htmlFor="admin-add-file" className="btn btn-sm cursor-pointer">Seleccionar una imagen</label>

          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Previsualización:</p>
              <img src={previewUrl} alt="preview" className="w-48 h-48 object-contain border" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categorías</label>
          {!categoriesLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2">
                  <input type="checkbox" value={cat.id} checked={selectedCategoryIds.includes(cat.id)} onChange={e => {
                    const id = Number(e.target.value);
                    setSelectedCategoryIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
                  }} />
                  <span className="text-sm">{cat.nombre}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Cargando categorías...</div>
          )}
        </div>

        <div>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando...' : 'Crear Producto'}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminProductService } from '../api/adminProductService';
import { useNotification } from '../context/NotificationContext';
import { useCategories } from '../hooks/useCategories';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useNotification();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [productCategoryNames, setProductCategoryNames] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminProductService.getProductById(id);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setPrecio(data.precio);
        setImagenes(data.imagenes || []);
        // inicializar categorías si vienen
        if (Array.isArray(data.categoriaIds) && data.categoriaIds.length > 0) {
          setSelectedCategoryIds(data.categoriaIds.map(Number));
        } else if (data.categorias && Array.isArray(data.categorias)) {
          // guardar nombres y mapear a ids cuando 'categories' esté disponible
          setProductCategoryNames(data.categorias);
          const ids = (categories || []).filter(c => data.categorias.includes(c.nombre)).map(c => c.id);
          if (ids.length > 0) setSelectedCategoryIds(ids);
        }
      } catch (err) {
        console.error(err);
        show('Error cargando producto', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Si recibimos nombres de categorías en el producto y las categorías globales se cargan después,
  // mapear los nombres a ids para preseleccionar los checkboxes.
  useEffect(() => {
    if ((!selectedCategoryIds || selectedCategoryIds.length === 0) && productCategoryNames && categories && categories.length > 0) {
      const ids = categories.filter(c => productCategoryNames.includes(c.nombre)).map(c => c.id);
      if (ids.length > 0) setSelectedCategoryIds(ids);
    }
  }, [productCategoryNames, categories]);

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

      const dto = {
        nombre,
        descripcion,
        precio: precioNum,
        activo: true,
        categoriaIds: selectedCategoryIds,
        imagenes: imagenes,
      };

      await adminProductService.updateProduct(id, dto);
      show('Producto actualizado', 'success');
      navigate('/inventario');
    } catch (err) {
      console.error(err);
      show('Error actualizando producto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>
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
          <label className="block text-sm font-medium">Imágenes</label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input id="admin-edit-file" type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files[0];
                if (!f) return;
                setSelectedFile(f);
                const url = URL.createObjectURL(f);
                setPreviewUrl(url);
              }} />
              <label htmlFor="admin-edit-file" className="btn btn-sm cursor-pointer">Seleccionar una imagen</label>
              <button type="button" className="btn btn-sm" onClick={() => setImagenes([])}>Quitar todas</button>
            </div>

            {previewUrl && (
              <div className="flex items-center gap-2">
                <img src={previewUrl} alt="preview" className="w-24 h-24 object-contain border" />
                <div className="flex flex-col gap-2">
                  <button type="button" className="btn btn-sm btn-primary" disabled={uploading} onClick={async () => {
                    if (!selectedFile) return;
                    setUploading(true);
                    try {
                      const url = await adminProductService.uploadImage(selectedFile);
                      setImagenes(prev => [...prev, url]);
                      show('Imagen subida', 'success');
                      // limpiar selection
                      setSelectedFile(null);
                      try { URL.revokeObjectURL(previewUrl); } catch (e) {}
                      setPreviewUrl(null);
                    } catch (err) {
                      console.error(err);
                      show('Error subiendo imagen', 'error');
                    } finally {
                      setUploading(false);
                    }
                  }}>{uploading ? 'Subiendo...' : 'Subir imagen'}</button>
                  <button type="button" className="btn btn-sm" onClick={() => {
                    if (previewUrl) {
                      try { URL.revokeObjectURL(previewUrl); } catch (e) {}
                    }
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}>Cancelar</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            {imagenes.map((img, idx) => (
              <div key={idx} className="border p-1">
                <img src={img} alt={`img-${idx}`} className="w-24 h-24 object-contain" />
                <div className="flex gap-1 mt-1">
                  <button type="button" className="btn btn-xs btn-error" onClick={() => setImagenes(prev => prev.filter((_,i)=>i!==idx))}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          {uploading && <p className="text-sm text-gray-600">Subiendo imagen...</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categorías</label>
          {!categoriesLoading ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
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
            <div className="text-sm text-gray-500 mb-4">Cargando categorías...</div>
          )}

          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminProductService } from '../api/adminProductService';
import { useNotification } from '../context/NotificationContext';

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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminProductService.getProductById(id);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setPrecio(data.precio);
        setImagenes(data.imagenes || []);
      } catch (err) {
        console.error(err);
        show('Error cargando producto', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dto = {
        nombre,
        descripcion,
        precio: Number(precio),
        activo: true,
        categoriaIds: [],
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
          <input value={precio} onChange={e => setPrecio(e.target.value)} className="input w-full" type="number" required />
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
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;

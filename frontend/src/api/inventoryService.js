import apiClient from './apiClient';
import { adminProductService } from './adminProductService';

export const inventoryService = {
  // No existe endpoint público para listar inventarios en el backend; usaremos productos como base y permitiremos actualizar stock para cada producto
  actualizarStock: (idProducto, payload) => apiClient.put(`/admin/inventario/${idProducto}`, payload),
  
  // Función simplificada para desactivar productos sin stock después de una compra
  desactivarProductosSinStock: async (items) => {
    console.log("🔄 === DESACTIVANDO PRODUCTOS SIN STOCK ===");
    const resultados = [];
    
    for (const item of items) {
      try {
        console.log(`\n--- Verificando producto ${item.idProducto} ---`);
        
        // Obtener información actual del producto
        const producto = await adminProductService.getProductById(item.idProducto);
        console.log(`Producto: ${producto.nombre}, Stock actual: ${producto.stockActual}, Activo: ${producto.activo}`);
        
        // Si el stock es 0 y el producto está activo, desactivarlo
        if ((producto.stockActual === 0 || producto.stockActual === null) && producto.activo) {
          console.log(`🔴 Desactivando producto ${item.idProducto} por stock = 0`);
          
          const updateDto = {
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            precio: producto.precio,
            activo: false,
            categoriaIds: producto.categoriaIds || [],
            imagenes: producto.imagenes || []
          };
          
          await adminProductService.updateProduct(item.idProducto, updateDto);
          console.log(`✅ Producto ${item.idProducto} desactivado correctamente`);
          
          resultados.push({
            idProducto: item.idProducto,
            desactivado: true,
            success: true
          });
        } else {
          console.log(`ℹ️ Producto ${item.idProducto} no necesita desactivación (stock: ${producto.stockActual}, activo: ${producto.activo})`);
          resultados.push({
            idProducto: item.idProducto,
            desactivado: false,
            success: true
          });
        }
        
      } catch (error) {
        console.error(`❌ Error procesando producto ${item.idProducto}:`, error);
        resultados.push({
          idProducto: item.idProducto,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log("🔄 === RESUMEN DE DESACTIVACIÓN ===");
    console.log("Resultados:", resultados);
    return resultados;
  },
};

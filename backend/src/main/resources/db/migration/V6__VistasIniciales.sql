--VISTA PARA MOSTRAR LOS DATOS DE UN PRODUCTO AL CLIENTE
CREATE OR REPLACE VIEW v_datos_producto AS
SELECT
    pr.id_producto, --En principio no se muestra al cliente(frontend)
    pr.nombre, -- Nombre del producto
    pr.descripcion, -- Su descripcion que puede ser un texto largo
    pr.precio, --su precio
    i.stock_actual, --stock del producto que se trae del join con inventarios
    STRING_AGG(DISTINCT c.nombre, ', ' ORDER BY c.nombre) AS categorias, --categorias concatenadas
    JSON_AGG(DISTINCT img.path_imagen ORDER BY img.path_imagen) AS imagenes --rutas de imagenes en json para consumir desde react
FROM productos pr
         JOIN inventarios i ON i.id_producto = pr.id_producto
         LEFT JOIN productos_categorias pc ON pr.id_producto = pc.id_producto
         LEFT JOIN categorias c ON c.id_categoria = pc.id_categoria
         LEFT JOIN imagenes img ON img.id_producto = pr.id_producto
GROUP BY pr.id_producto, pr.nombre, pr.descripcion, pr.precio, i.stock_actual
ORDER BY pr.nombre;

--VISTA GENERAL SIMPLIFICADA PARA LOS PRODUCTOS DEL CATALOGO
CREATE OR REPLACE VIEW v_datos_productos_simple AS
SELECT
    p.id_producto,
    p.nombre,
    p.precio,
    p.activo,
    ROUND(AVG(r.calificacion), 2) AS calificacion_promedio,
    (SELECT path_imagen
     FROM imagenes
     WHERE id_producto = p.id_producto
     LIMIT 1) AS imagen
FROM productos p
         LEFT JOIN resenas r ON p.id_producto = r.id_producto
GROUP BY p.id_producto, p.nombre, p.precio, p.activo
ORDER BY p.nombre;
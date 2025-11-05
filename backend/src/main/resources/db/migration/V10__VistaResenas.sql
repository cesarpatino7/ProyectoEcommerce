--VISTA PARA MOSTRAR LAS RESENAS DE UN PRODUCTO(siempre se debe hacer "WHERE id_producto=")
CREATE OR REPLACE VIEW v_resenas_producto AS
SELECT
    r.id_producto,
    p.nombre AS producto,
    r.id_usuario,
    CONCAT(u.nombre, ' ', u.apellido) AS usuario,
    r.calificacion,
    r.comentario,
    r.fecha_publicacion
FROM resenas r
         JOIN productos p ON r.id_producto = p.id_producto
         JOIN usuarios u ON r.id_usuario = u.id_usuario
ORDER BY r.fecha_publicacion DESC;

-- Crear índice para mejorar rendimiento en consultas por producto y fecha
CREATE INDEX IF NOT EXISTS idx_resenas_producto_fecha
    ON resenas(id_producto, fecha_publicacion);
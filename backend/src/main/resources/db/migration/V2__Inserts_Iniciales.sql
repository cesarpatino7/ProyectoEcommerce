-- Los datos para 'departamentos' ya eran correctos y no necesitaron cambios.
INSERT INTO departamentos (nombre) VALUES
                                       ('Capital'),
                                       ('Concepcion'),
                                       ('San Pedro'),
                                       ('Cordillera'),
                                       ('Guaira'),
                                       ('Caaguazu'),
                                       ('Caazapa'),
                                       ('Itapua'),
                                       ('Misiones'),
                                       ('Paraguari'),
                                       ('Alto Parana'),
                                       ('Central'),
                                       ('Ñeembucu'),
                                       ('Amambay'),
                                       ('Canindeyu'),
                                       ('Presidente Hayes'),
                                       ('Alto Paraguay'),
                                       ('Boqueron');


-- =============================================
-- ROLES DEL SISTEMA
-- =============================================

-- CORRECCIÓN: El nombre de la tabla cambió de 'rolUsuario' a 'roles'.
INSERT INTO roles (descripcion) VALUES
                                    ('ROLE_CUSTOMER'),      -- ID 1
                                    ('ROLE_PRODUCT_MANAGER'), -- ID 2
                                    ('ROLE_ORDER_MANAGER'),   -- ID 3
                                    ('ROLE_SUPER_ADMIN');     -- ID 4

-- =============================================
-- TIPOS DE MOVIMIENTO DE INVENTARIO
-- =============================================

-- CORRECCIÓN: El nombre de la tabla cambió de 'tipo_movimiento' a 'tipos_movimiento' (plural).
INSERT INTO tipos_movimiento (descripcion) VALUES
                                               ('Entrada por compra'),
                                               ('Salida por venta'),
                                               ('Ajuste manual de inventario');

-- =============================================
-- ESTADOS DEL SISTEMA
-- =============================================

-- CORRECCIÓN: El nombre de la tabla cambió de 'tipo_estado' a 'tipos_estado' (plural).
INSERT INTO tipos_estado (descripcion) VALUES
                                           ('Estado de Pedido'),
                                           ('Estado de Pago');

-- CORRECCIÓN: El nombre de la columna cambió de 'idTipoEstado' (camelCase) a 'id_tipo_estado' (snake_case).
INSERT INTO estados (descripcion, id_tipo_estado) VALUES
                                                      ('Pendiente', 1),
                                                      ('Procesando', 1),
                                                      ('Enviado', 1),
                                                      ('Entregado', 1),
                                                      ('Cancelado', 1),
                                                      ('Pendiente', 2),
                                                      ('Aprobado', 2),
                                                      ('Rechazado', 2);


-- =============================================
-- CATEGORÍAS BÁSICAS
-- =============================================

-- Los datos para 'categorias' ya eran correctos y no necesitaron cambios.
INSERT INTO categorias (nombre, descripcion) VALUES
                                                 ('Cítricos', 'Fragancias frescas con notas de limón, naranja, bergamota y pomelo. Ideales para uso diario y clima cálido.'),
                                                 ('Florales', 'Perfumes con esencias de flores como rosa, jazmín, peonía y lirio. Femeninos y románticos.'),
                                                 ('Orientales', 'Fragancias cálidas y especiadas con ámbar, vainilla, incienso y especias. Sensuales y envolventes.'),
                                                 ('Amaderados', 'Perfumes con notas de madera como sándalo, cedro, vetiver y patchouli. Elegantes y sofisticados.'),
                                                 ('Masculinos', 'Perfumes diseñados tradicionalmente para hombres. Notas más intensas y viriles.'),
                                                 ('Femeninos', 'Fragancias creadas para mujeres. Delicadas, florales y sofisticadas.'),
                                                 ('Unisex', 'Perfumes que pueden ser usados por cualquier género. Versátiles y modernos.'),
                                                 ('Eau de Toilette', 'Concentración ligera (5-15% aceites). Frescas y para uso diario.'),
                                                 ('Eau de Parfum', 'Concentración media (15-20% aceites). Duraderas y elegantes.'),
                                                 ('Parfum', 'Máxima concentración (20-30% aceites). Exclusivas y de larga duración.'),
                                                 ('Día', 'Perfumes ligeros y frescos, perfectos para uso diurno y oficina.'),
                                                 ('Noche', 'Fragancias intensas y seductoras para eventos nocturnos.'),
                                                 ('Sport', 'Perfumes frescos y energizantes, ideales para actividades deportivas.'),
                                                 ('Formal', 'Fragancias elegantes y sofisticadas para eventos formales y de negocios.'),
                                                 ('Verano', 'Perfumes frescos y ligeros, perfectos para clima cálido.'),
                                                 ('Invierno', 'Fragancias cálidas y envolventes para temperaturas frías.'),
                                                 ('Primavera', 'Perfumes florales y frescos que evocan el renacimiento.'),
                                                 ('Otoño', 'Fragancias especiadas y amadeiradas para la transición del año.'),
                                                 ('Nicho', 'Perfumes de casas especializadas, únicos y exclusivos.'),
                                                 ('Diseñador', 'Fragancias de marcas de moda reconocidas mundialmente.'),
                                                 ('Vintage', 'Fragancias clásicas y atemporales que han marcado época.'),
                                                 ('Acuáticos', 'Perfumes que evocan el mar y la brisa marina. Frescos y limpios.'),
                                                 ('Verde', 'Perfumes con notas de hojas verdes, hierba recién cortada y naturaleza.');
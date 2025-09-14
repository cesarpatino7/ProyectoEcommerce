-- =============================================
-- Flyway Migration Script
-- V2__Inserts_iniciales.sql
-- Datos iniciales del sistema
-- =============================================

-- =============================================
-- DATOS DE UBICACIÓN
-- =============================================

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

/*
INSERT INTO ciudad (nombre, idDepartamento) VALUES 
('Aregua', 12),
('Capiata', 12),
('Fernando de la Mora', 12),
('Guarambare', 12),
('Ita', 12),
('Itagua', 12),
('J. Augusto Saldivar', 12),
('Lambare', 12),
('Limpio', 12),
('Luque', 12),
('Mariano Roque Alonso', 12),
('Ñemby', 12),
('Nueva Italia', 12),
('San Antonio', 12),
('San Lorenzo', 12),
('Villa Elisa', 12),
('Villeta', 12),
('Ypacarai', 12),
('Ypane', 12),
('Asuncion', 1);
 */
-- =============================================
-- ROLES DEL SISTEMA
-- =============================================

INSERT INTO rolUsuario (descripcion) VALUES
('Administrador'),
('Cliente');

-- =============================================
-- TIPOS DE MOVIMIENTO DE INVENTARIO
-- =============================================

INSERT INTO tipo_movimiento (descripcion) VALUES 
('Entrada por compra'),
('Salida por venta'),
('Ajuste manual de inventario');

-- =============================================
-- ESTADOS DEL SISTEMA
-- =============================================

INSERT INTO tipo_estado (descripcion) VALUES 
('Estado de Pedido'),
('Estado de Pago');

INSERT INTO estados (descripcion, idTipoEstado) VALUES 
('Pendiente', 1),
('Pagado', 1),
('Entregado', 1);

-- =============================================
-- CATEGORÍAS BÁSICAS
-- =============================================

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
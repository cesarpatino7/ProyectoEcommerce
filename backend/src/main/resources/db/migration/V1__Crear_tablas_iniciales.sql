-- =============================================
-- Flyway Migration Script
-- V2__Crear_tablas_iniciales.sql
-- Sistema de eCommerce - PostgreSQL
-- =============================================

-- =============================================
-- TABLAS PARA DIRECCIONES
-- =============================================

CREATE TABLE departamentos (
                               idDepartamento SERIAL PRIMARY KEY,
                               nombre VARCHAR(20) NOT NULL
);

CREATE TABLE ciudad (
                        idCiudad SERIAL PRIMARY KEY,
                        nombre VARCHAR(30) NOT NULL,
                        idDepartamento INT NOT NULL,
                        CONSTRAINT fk_ciudad_departamento FOREIGN KEY (idDepartamento)
                            REFERENCES departamentos(idDepartamento)
);

-- =============================================
-- TABLA DE ROLES (Crear primero para evitar dependencias circulares)
-- =============================================

CREATE TABLE RolUsuario (
                            idRol SERIAL PRIMARY KEY,
                            descripcion VARCHAR(30) NOT NULL
);

-- =============================================
-- TABLA DE USUARIOS Y DIRECCIONES
-- =============================================

CREATE TABLE usuarios (
                          idUsuario SERIAL PRIMARY KEY,
                          nombres VARCHAR(50) NOT NULL,
                          apellidos VARCHAR(50) NOT NULL,
                          email VARCHAR(100) NOT NULL UNIQUE,
                          password VARCHAR(255) NOT NULL,
                          telefono INT,
                          idRol INT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_usuarios_rol FOREIGN KEY (idRol)
                              REFERENCES RolUsuario(idRol)
);

CREATE TABLE direcciones (
                             idDireccion SERIAL PRIMARY KEY,
                             idUsuario INT NOT NULL,
                             descripcion_calle TEXT NOT NULL,
                             idCiudad INT NOT NULL,
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_direcciones_usuario FOREIGN KEY (idUsuario)
                                 REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
                             CONSTRAINT fk_direcciones_ciudad FOREIGN KEY (idCiudad)
                                 REFERENCES ciudad(idCiudad)
);

-- =============================================
-- CATÁLOGOS DE PRODUCTOS
-- =============================================

CREATE TABLE categorias (
                            idCategoria SERIAL PRIMARY KEY,
                            nombre VARCHAR(50) NOT NULL,
                            descripcion TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
                           idProducto SERIAL PRIMARY KEY,
                           nombre VARCHAR(100) NOT NULL,
                           descripcion TEXT NOT NULL,
                           precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
                           activo BOOLEAN NOT NULL DEFAULT true,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia para relación muchos a muchos
CREATE TABLE producto_categoria (
                                    idProducto INT NOT NULL,
                                    idCategoria INT NOT NULL,
                                    PRIMARY KEY (idProducto, idCategoria),
                                    CONSTRAINT fk_producto_categoria_producto FOREIGN KEY (idProducto)
                                        REFERENCES productos(idProducto) ON DELETE CASCADE,
                                    CONSTRAINT fk_producto_categoria_categoria FOREIGN KEY (idCategoria)
                                        REFERENCES categorias(idCategoria) ON DELETE CASCADE
);

-- =============================================
-- TABLA DE RESEÑAS
-- =============================================

CREATE TABLE resenas (
                         idResena SERIAL PRIMARY KEY,
                         idUsuario INT NOT NULL,
                         idProducto INT NOT NULL,
                         calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
                         comentario TEXT,
                         fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_resenas_usuario FOREIGN KEY (idUsuario)
                             REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
                         CONSTRAINT fk_resenas_producto FOREIGN KEY (idProducto)
                             REFERENCES productos(idProducto) ON DELETE CASCADE
);

-- =============================================
-- TABLA DE IMÁGENES
-- =============================================

CREATE TABLE imagenes (
                          idImagen SERIAL PRIMARY KEY,
                          path_imagen VARCHAR(255) NOT NULL,
                          idProducto INT NOT NULL,
                          CONSTRAINT fk_imagenes_producto FOREIGN KEY (idProducto)
                              REFERENCES productos(idProducto) ON DELETE CASCADE
);

-- =============================================
-- GESTIÓN DE INVENTARIO
-- =============================================

CREATE TABLE tipo_movimiento (
                                 idTipoMovimiento SERIAL PRIMARY KEY,
                                 descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE inventario (
                            idInventario SERIAL PRIMARY KEY,
                            idProducto INT NOT NULL UNIQUE,
                            stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
                            stock_minimo INT DEFAULT 0 CHECK (stock_minimo >= 0),
                            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT fk_inventario_producto FOREIGN KEY (idProducto)
                                REFERENCES productos(idProducto) ON DELETE CASCADE
);

CREATE TABLE movimiento_inventario (
                                       idMovimientoInventario SERIAL PRIMARY KEY,
                                       idInventario INT NOT NULL,
                                       cantidad INT NOT NULL,
                                       fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       referencia VARCHAR(100),
                                       idTipoMovimiento INT NOT NULL,
                                       CONSTRAINT fk_movimiento_inventario FOREIGN KEY (idInventario)
                                           REFERENCES inventario(idInventario) ON DELETE CASCADE,
                                       CONSTRAINT fk_movimiento_tipo FOREIGN KEY (idTipoMovimiento)
                                           REFERENCES tipo_movimiento(idTipoMovimiento)
);

-- =============================================
-- GESTIÓN DE ESTADOS
-- =============================================

CREATE TABLE tipo_estado (
                             idTipoEstado SERIAL PRIMARY KEY,
                             descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE estados (
                         idEstado SERIAL PRIMARY KEY,
                         descripcion VARCHAR(50) NOT NULL,
                         idTipoEstado INT NOT NULL,
                         CONSTRAINT fk_estados_tipo FOREIGN KEY (idTipoEstado)
                             REFERENCES tipo_estado(idTipoEstado)
);

-- =============================================
-- GESTIÓN DE CARRITO Y PEDIDOS
-- =============================================

CREATE TABLE carrito (
                         idCarrito SERIAL PRIMARY KEY,
                         fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         idUsuario INT NOT NULL,
                         CONSTRAINT fk_carrito_usuario FOREIGN KEY (idUsuario)
                             REFERENCES usuarios(idUsuario) ON DELETE CASCADE
);

CREATE TABLE items_carrito (
                               id_item_carrito SERIAL PRIMARY KEY,
                               cantidad INT NOT NULL CHECK (cantidad > 0),
                               idCarrito INT NOT NULL,
                               idProducto INT NOT NULL,
                               CONSTRAINT fk_items_carrito FOREIGN KEY (idCarrito)
                                   REFERENCES carrito(idCarrito) ON DELETE CASCADE,
                               CONSTRAINT fk_items_producto FOREIGN KEY (idProducto)
                                   REFERENCES productos(idProducto) ON DELETE CASCADE,
                               UNIQUE(idCarrito, idProducto)
);

CREATE TABLE pedido (
                        idPedido SERIAL PRIMARY KEY,
                        idUsuario INT NOT NULL,
                        idEstado INT NOT NULL,
                        idDireccion INT NOT NULL,
                        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        fecha_entrega TIMESTAMP,
                        total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
                        CONSTRAINT fk_pedido_usuario FOREIGN KEY (idUsuario)
                            REFERENCES usuarios(idUsuario),
                        CONSTRAINT fk_pedido_estado FOREIGN KEY (idEstado)
                            REFERENCES estados(idEstado),
                        CONSTRAINT fk_pedido_direccion FOREIGN KEY (idDireccion)
                            REFERENCES direcciones(idDireccion)
);

CREATE TABLE detalle_pedido (
                                idDetallePedido SERIAL PRIMARY KEY,
                                idPedido INT NOT NULL,
                                idProducto INT NOT NULL,
                                cantidad INT NOT NULL CHECK (cantidad > 0),
                                precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
                                CONSTRAINT fk_detalle_pedido FOREIGN KEY (idPedido)
                                    REFERENCES pedido(idPedido) ON DELETE CASCADE,
                                CONSTRAINT fk_detalle_producto FOREIGN KEY (idProducto)
                                    REFERENCES productos(idProducto)
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(idRol);
CREATE INDEX idx_direcciones_usuario ON direcciones(idUsuario);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_inventario_producto ON inventario(idProducto);
CREATE INDEX idx_resenas_producto ON resenas(idProducto);
CREATE INDEX idx_resenas_usuario ON resenas(idUsuario);
CREATE INDEX idx_pedido_usuario ON pedido(idUsuario);
CREATE INDEX idx_pedido_fecha ON pedido(fecha_pedido);
CREATE INDEX idx_detalle_pedido ON detalle_pedido(idPedido);
CREATE INDEX idx_movimiento_fecha ON movimiento_inventario(fecha_movimiento);
CREATE INDEX idx_carrito_usuario ON carrito(idUsuario);
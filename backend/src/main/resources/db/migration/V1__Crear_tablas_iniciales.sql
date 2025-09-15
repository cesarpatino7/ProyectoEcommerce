-- Creación de la tabla de Departamentos
CREATE TABLE departamentos (
                               id_departamento SERIAL PRIMARY KEY,
                               nombre VARCHAR(20) NOT NULL
);

-- Creación de la tabla de Ciudades
CREATE TABLE ciudades (
                          id_ciudad SERIAL PRIMARY KEY,
                          nombre VARCHAR(30) NOT NULL,
                          id_departamento INT NOT NULL,
                          CONSTRAINT fk_ciudades_departamentos FOREIGN KEY (id_departamento)
                              REFERENCES departamentos(id_departamento)
);

-- Creación de la tabla de Roles
CREATE TABLE roles (
                       id_rol SERIAL PRIMARY KEY,
                       descripcion VARCHAR(30) NOT NULL
);

-- Creación de la tabla de Usuarios
CREATE TABLE usuarios (
                          id_usuario SERIAL PRIMARY KEY,
                          nombre VARCHAR(50) NOT NULL,
                          apellido VARCHAR(50) NOT NULL,
                          email VARCHAR(100) NOT NULL UNIQUE,
                          password VARCHAR(255) NOT NULL,
                          telefono VARCHAR(255),
                          id_rol INT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol)
                              REFERENCES roles(id_rol)
);

-- Creación de la tabla de Direcciones
CREATE TABLE direcciones (
                             id_direccion SERIAL PRIMARY KEY,
                             id_usuario INT NOT NULL,
                             descripcion_calle TEXT NOT NULL,
                             id_ciudad INT NOT NULL,
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_direcciones_usuarios FOREIGN KEY (id_usuario)
                                 REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                             CONSTRAINT fk_direcciones_ciudades FOREIGN KEY (id_ciudad)
                                 REFERENCES ciudades(id_ciudad)
);

-- Creación de la tabla de Categorías
CREATE TABLE categorias (
                            id_categoria SERIAL PRIMARY KEY,
                            nombre VARCHAR(50) NOT NULL,
                            descripcion TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla de Productos
CREATE TABLE productos (
                           id_producto SERIAL PRIMARY KEY,
                           nombre VARCHAR(100) NOT NULL,
                           descripcion TEXT NOT NULL,
                           precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
                           activo BOOLEAN NOT NULL DEFAULT true,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de unión para Productos y Categorías
CREATE TABLE productos_categorias (
                                      id_producto INT NOT NULL,
                                      id_categoria INT NOT NULL,
                                      PRIMARY KEY (id_producto, id_categoria),
                                      CONSTRAINT fk_productos_categorias_productos FOREIGN KEY (id_producto)
                                          REFERENCES productos(id_producto) ON DELETE CASCADE,
                                      CONSTRAINT fk_productos_categorias_categorias FOREIGN KEY (id_categoria)
                                          REFERENCES categorias(id_categoria) ON DELETE CASCADE
);

-- Creación de la tabla de Reseñas
CREATE TABLE resenas (
                         id_resena SERIAL PRIMARY KEY,
                         id_usuario INT NOT NULL,
                         id_producto INT NOT NULL,
                         calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
                         comentario TEXT,
                         fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_resenas_usuarios FOREIGN KEY (id_usuario)
                             REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                         CONSTRAINT fk_resenas_productos FOREIGN KEY (id_producto)
                             REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- Creación de la tabla de Imágenes de Productos
CREATE TABLE imagenes (
                          id_imagen SERIAL PRIMARY KEY,
                          path_imagen VARCHAR(255) NOT NULL,
                          id_producto INT NOT NULL,
                          CONSTRAINT fk_imagenes_productos FOREIGN KEY (id_producto)
                              REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- Creación de la tabla de Tipos de Movimiento de Inventario
CREATE TABLE tipos_movimiento (
                                  id_tipo_movimiento SERIAL PRIMARY KEY,
                                  descripcion VARCHAR(50) NOT NULL
);

-- Creación de la tabla de Inventarios
CREATE TABLE inventarios (
                             id_inventario SERIAL PRIMARY KEY,
                             id_producto INT NOT NULL UNIQUE,
                             stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
                             stock_minimo INT DEFAULT 0 CHECK (stock_minimo >= 0),
                             fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_inventarios_productos FOREIGN KEY (id_producto)
                                 REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- Creación de la tabla de Movimientos de Inventario
CREATE TABLE movimientos_inventario (
                                        id_movimiento_inventario SERIAL PRIMARY KEY,
                                        id_inventario INT NOT NULL,
                                        cantidad INT NOT NULL,
                                        fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        referencia VARCHAR(100),
                                        id_tipo_movimiento INT NOT NULL,
                                        CONSTRAINT fk_movimientos_inventario_inventarios FOREIGN KEY (id_inventario)
                                            REFERENCES inventarios(id_inventario) ON DELETE CASCADE,
                                        CONSTRAINT fk_movimientos_inventario_tipos_movimiento FOREIGN KEY (id_tipo_movimiento)
                                            REFERENCES tipos_movimiento(id_tipo_movimiento)
);

-- Creación de la tabla de Tipos de Estado (para pedidos, etc.)
CREATE TABLE tipos_estado (
                              id_tipo_estado SERIAL PRIMARY KEY,
                              descripcion VARCHAR(50) NOT NULL
);

-- Creación de la tabla de Estados
CREATE TABLE estados (
                         id_estado SERIAL PRIMARY KEY,
                         descripcion VARCHAR(50) NOT NULL,
                         id_tipo_estado INT NOT NULL,
                         CONSTRAINT fk_estados_tipos_estado FOREIGN KEY (id_tipo_estado)
                             REFERENCES tipos_estado(id_tipo_estado)
);

-- Creación de la tabla de Carritos de Compra
CREATE TABLE carritos (
                          id_carrito SERIAL PRIMARY KEY,
                          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          id_usuario INT NOT NULL,
                          CONSTRAINT fk_carritos_usuarios FOREIGN KEY (id_usuario)
                              REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Creación de la tabla de Ítems del Carrito
CREATE TABLE items_carrito (
                               id_item_carrito SERIAL PRIMARY KEY,
                               cantidad INT NOT NULL CHECK (cantidad > 0),
                               id_carrito INT NOT NULL,
                               id_producto INT NOT NULL,
                               CONSTRAINT fk_items_carrito_carritos FOREIGN KEY (id_carrito)
                                   REFERENCES carritos(id_carrito) ON DELETE CASCADE,
                               CONSTRAINT fk_items_carrito_productos FOREIGN KEY (id_producto)
                                   REFERENCES productos(id_producto) ON DELETE CASCADE,
                               UNIQUE(id_carrito, id_producto)
);

-- Creación de la tabla de Pedidos
CREATE TABLE pedidos (
                         id_pedido SERIAL PRIMARY KEY,
                         id_usuario INT NOT NULL,
                         id_estado INT NOT NULL,
                         id_direccion INT NOT NULL,
                         fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         fecha_entrega TIMESTAMP,
                         total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
                         CONSTRAINT fk_pedidos_usuarios FOREIGN KEY (id_usuario)
                             REFERENCES usuarios(id_usuario),
                         CONSTRAINT fk_pedidos_estados FOREIGN KEY (id_estado)
                             REFERENCES estados(id_estado),
                         CONSTRAINT fk_pedidos_direcciones FOREIGN KEY (id_direccion)
                             REFERENCES direcciones(id_direccion)
);

-- Creación de la tabla de Detalles de Pedido
CREATE TABLE detalles_pedido (
                                 id_detalle_pedido SERIAL PRIMARY KEY,
                                 id_pedido INT NOT NULL,
                                 id_producto INT NOT NULL,
                                 cantidad INT NOT NULL CHECK (cantidad > 0),
                                 precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
                                 CONSTRAINT fk_detalles_pedido_pedidos FOREIGN KEY (id_pedido)
                                     REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
                                 CONSTRAINT fk_detalles_pedido_productos FOREIGN KEY (id_producto)
                                     REFERENCES productos(id_producto)
);

-- Creación de Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);
CREATE INDEX idx_direcciones_usuario ON direcciones(id_usuario);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_inventarios_producto ON inventarios(id_producto);
CREATE INDEX idx_resenas_producto ON resenas(id_producto);
CREATE INDEX idx_resenas_usuario ON resenas(id_usuario);
CREATE INDEX idx_pedidos_usuario ON pedidos(id_usuario);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);
CREATE INDEX idx_detalles_pedido ON detalles_pedido(id_pedido);
CREATE INDEX idx_movimientos_inventario_fecha ON movimientos_inventario(fecha_movimiento);
CREATE INDEX idx_carritos_usuario ON carritos(id_usuario);
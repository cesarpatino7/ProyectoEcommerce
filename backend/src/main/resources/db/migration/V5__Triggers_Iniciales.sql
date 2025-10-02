-- ============================================
-- FUNCIONES PARA TRIGGERS
-- ============================================

-- Función para crear inventario automáticamente al crear producto (se crea un registro en producto --> se crea en inventario)
CREATE OR REPLACE FUNCTION crear_inventario_producto()
    RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inventarios (id_producto, stock_actual)
    VALUES (NEW.id_producto, 0);

    RAISE NOTICE 'Inventario creado automáticamente para producto ID: %', NEW.id_producto;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar stock automáticamente cuando se crea un pedido (SALIDA POR VENTA)
-- Para el trigger que reste el stock de un producto cuando se venda
CREATE OR REPLACE FUNCTION actualizar_stock_por_pedido()
    RETURNS TRIGGER AS $$
DECLARE
    stock_disponible INT;
BEGIN
    -- Verificar stock disponible
    SELECT stock_actual INTO stock_disponible
    FROM inventarios
    WHERE id_producto = NEW.id_producto;

    IF stock_disponible < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto seleccionado.';
    END IF;

    -- Reducir el stock
    UPDATE inventarios
    SET stock_actual = stock_actual - NEW.cantidad,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id_producto = NEW.id_producto;

    -- Registrar el movimiento de inventario
    INSERT INTO movimientos_inventario (id_inventario, cantidad, referencia, id_tipo_movimiento)
    SELECT i.id_inventario, -NEW.cantidad, 'Pedido #' || NEW.id_pedido, 2
    FROM inventarios i
    WHERE i.id_producto = NEW.id_producto;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar fecha_actualizacion del inventario
CREATE OR REPLACE FUNCTION actualizar_fecha_inventario()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para evitar productos duplicados en el carrito
CREATE OR REPLACE FUNCTION validar_producto_carrito()
    RETURNS TRIGGER AS $$
BEGIN
    -- Si el producto ya existe en el carrito, actualizar cantidad(se ve en los sp)
    IF EXISTS (
        SELECT 1 FROM items_carrito
        WHERE id_carrito = NEW.id_carrito
          AND id_producto = NEW.id_producto
          AND id_item_carrito != COALESCE(NEW.id_item_carrito, 0)
    ) THEN
        RAISE EXCEPTION 'El producto ya existe en el carrito.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar movimiento cuando se actualiza inventario manualmente
CREATE OR REPLACE FUNCTION registrar_movimiento_inventario()
    RETURNS TRIGGER AS $$
DECLARE
    diferencia INT;
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.stock_actual != NEW.stock_actual THEN
        diferencia := NEW.stock_actual - OLD.stock_actual;

        INSERT INTO movimientos_inventario (id_inventario, cantidad, id_tipo_movimiento)
        VALUES (
                   NEW.id_inventario,
                   diferencia,
                   3
               );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para validar stock mínimo
CREATE OR REPLACE FUNCTION validar_stock_minimo()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_actual < NEW.stock_minimo THEN
        RAISE NOTICE 'ALERTA: El producto ID % tiene stock bajo. Actual: %, Mínimo: %',
            NEW.id_producto, NEW.stock_actual, NEW.stock_minimo;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular total del pedido automáticamente
CREATE OR REPLACE FUNCTION calcular_total_pedido()
    RETURNS TRIGGER AS $$
DECLARE
    nuevo_total DECIMAL(10,2);
BEGIN
    -- Calcular el total sumando todos los detalles
    SELECT COALESCE(SUM(cantidad * precio_unitario), 0)
    INTO nuevo_total
    FROM detalles_pedido
    WHERE id_pedido = NEW.id_pedido;

    -- Actualizar el total en la tabla pedidos
    UPDATE pedidos
    SET total = nuevo_total
    WHERE id_pedido = NEW.id_pedido;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CREACIÓN DE TRIGGERS
-- ============================================

-- TRIGGER PRINCIPAL: Crear inventario automáticamente al insertar producto
CREATE TRIGGER trigger_crear_inventario_producto
    AFTER INSERT ON productos
    FOR EACH ROW
EXECUTE FUNCTION crear_inventario_producto();

-- Trigger para actualizar stock cuando se crea un detalle de pedido
CREATE TRIGGER trigger_actualizar_stock_pedido
    AFTER INSERT ON detalles_pedido
    FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_por_pedido();

-- Trigger para actualizar fecha de inventario
CREATE TRIGGER trigger_fecha_inventario
    BEFORE UPDATE ON inventarios
    FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_inventario();

-- Trigger para evitar duplicados en carrito
CREATE TRIGGER trigger_validar_carrito
    BEFORE INSERT ON items_carrito
    FOR EACH ROW
EXECUTE FUNCTION validar_producto_carrito();

-- Trigger para registrar movimientos de inventario
CREATE TRIGGER trigger_registrar_movimiento
    AFTER UPDATE ON inventarios
    FOR EACH ROW
EXECUTE FUNCTION registrar_movimiento_inventario();

-- Trigger para alertar stock bajo
CREATE TRIGGER trigger_alerta_stock_bajo
    AFTER UPDATE ON inventarios
    FOR EACH ROW
EXECUTE FUNCTION validar_stock_minimo();

-- Trigger para calcular total del pedido automáticamente
CREATE TRIGGER trigger_calcular_total_pedido
    AFTER INSERT OR UPDATE OR DELETE ON detalles_pedido
    FOR EACH ROW
EXECUTE FUNCTION calcular_total_pedido();

-- ============================================
-- COMENTARIOS EXPLICATIVOS
-- ============================================

COMMENT ON FUNCTION crear_inventario_producto() IS
    'Crea automáticamente un registro de inventario con stock 0 y stock mínimo 0 cuando se inserta un nuevo producto';

COMMENT ON FUNCTION actualizar_stock_por_pedido() IS
    'Actualiza el stock del inventario y registra el movimiento de tipo SALIDA cuando se crea un detalle de pedido';

COMMENT ON FUNCTION validar_stock_minimo() IS
    'Emite una alerta (NOTICE) cuando el stock actual es menor al stock mínimo configurado';

COMMENT ON FUNCTION calcular_total_pedido() IS
    'Calcula y actualiza automáticamente el total del pedido basado en los detalles';

COMMENT ON TRIGGER trigger_crear_inventario_producto ON productos IS
    'Trigger que crea automáticamente el inventario cuando se inserta un nuevo producto';


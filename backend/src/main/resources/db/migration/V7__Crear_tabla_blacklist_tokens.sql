CREATE TABLE invalidated_tokens (
                                    id BIGSERIAL PRIMARY KEY,
                                    jti VARCHAR(255) NOT NULL UNIQUE,
                                    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_invalidated_tokens_jti ON invalidated_tokens(jti);

COMMENT ON TABLE invalidated_tokens IS
'Almacena los identificadores (jti) de los tokens JWT que han sido explícitamente invalidados (ej. por logout) antes de su fecha de expiración.';
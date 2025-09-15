package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /**
     * Busca un usuario por su dirección de email.
     *
     * @param email el email del usuario a buscar.
     * @return un Optional que contendrá al usuario si se encuentra, o estará vacío si no.
     */
    Optional<Usuario> findByEmail(String email);

}
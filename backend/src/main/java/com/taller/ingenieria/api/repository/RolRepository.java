package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Integer> {

    /**
     * Busca un un rol por descripcion
     *
     * @param descripcion el rol a buscar.
     * @return un Optional que contendrá la descripcion del rol si se encuentra, o estará vacío si no.
     */
    Optional<Rol> findByDescripcion(String descripcion);

}
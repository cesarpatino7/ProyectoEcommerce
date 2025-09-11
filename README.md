Este repositorio contiene el código fuente para el backend y frontend de la aplicación de e-commerce, desarrollado con Spring Boot.

---

## 🚀 Requisitos Previos

Asegurarse de tener instaladas las siguientes herramientas antes de continuar:

* [Git](https://git-scm.com/)
* [Java 17 (JDK)](https://www.oracle.com/java/technologies/downloads/#java17)
* [Apache Maven](https://maven.apache.org/download.cgi)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## 🛠️ Pasos para la Instalación y Puesta en Marcha

Seguir estos pasos para levantar el entorno de desarrollo local:

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/cesarpatino7/ProyectoEcommerce.git
    cd ProyectoEcommerce
    ```

2.  **Configurar el Archivo de Propiedades:**
    * Navega a la carpeta `backend/src/main/resources/`.
    * Crea una copia del archivo `application.properties.template`.
    * Renombra la copia a `application.properties`. (Por ahora, no se necesitan cambios adicionales).

3.  **Levantar la Base de Datos:**
    * Asegurarse de que Docker Desktop esté en ejecución.
    * En la raíz del proyecto, ejecuta el siguiente comando para crear e iniciar el contenedor de la base de datos:
    ```bash
    docker-compose up -d
    ```

4.  **Ejecutar la Aplicación Backend:**
    * Abre la carpeta `backend` como un proyecto en el IDE.
    * Espera a que Maven descargue todas las dependencias.
    * Ejecuta la clase principal `ApiApplication.java`.

¡Listo! La API estará corriendo en `http://localhost:8080`.

---

## 📄 Endpoints de la API

Puedes ver y probar todos los endpoints disponibles a través de nuestra documentación interactiva de Swagger:

* **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
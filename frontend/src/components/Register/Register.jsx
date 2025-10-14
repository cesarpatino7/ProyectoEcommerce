import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      setMensajeError("");

      // 2. Mapeamos los nombres del formulario a los que espera el DTO del backend
      const userData = {
        nombre: data.name,
        apellido: data.lastname,
        email: data.email,
        password: data.password,
      };

      // 3. Usamos nuestro servicio para hacer la llamada a la API
      await authService.register(userData);

      // 4. Al registrar, hacemos login automático con las mismas credenciales
      const responseData = await authService.login(data.email, data.password);

      // 5. Guardamos el token en el contexto global (y localStorage lo maneja allí)
      login(responseData.token);

      reset();
      setMensajeExito(
        "✅ Registro e inicio de sesión exitosos, redirigiendo..."
      );

      // Redirigimos según el rol contenido en el token (igual que en Login.jsx)
      setTimeout(() => {
        const decodedToken = jwtDecode(responseData.token);
        if (
          decodedToken.role === "ROLE_SUPER_ADMIN" ||
          decodedToken.role === "ROLE_ORDER_MANAGER"
        ) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1200);
    } catch (error) {
      // El authService ya nos da el mensaje de error formateado (ej. "email ya existe")
      setMensajeExito("");
      setMensajeError(
        `❌ ${error.message || "No se pudo completar el registro"}`
      );
    }
  };

  return (
    <>
      {/* Lógica para mostrar mensajes de éxito y error */}
      {mensajeExito && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded shadow">
          {mensajeExito}
        </div>
      )}
      {mensajeError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded shadow">
          {mensajeError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-col gap-2 lg:gap-4 max-w-[500px] mx-auto"
      >
        {/* Nombre */}
        <div>
          <input
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: {
                value: 3,
                message: "El mínimo es de 3 caracteres",
              },
              maxLength: {
                value: 16,
                message: "El máximo es de 16 caracteres",
              },
            })}
            placeholder="Nombres"
            className={`p-2 outline-2 rounded w-full ${
              errors.name ? "border-red-400" : ""
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <input
            {...register("lastname", {
              required: "El apellido es obligatorio",
              minLength: {
                value: 3,
                message: "El mínimo es de 3 caracteres",
              },
              maxLength: {
                value: 16,
                message: "El máximo es de 16 caracteres",
              },
            })}
            placeholder="Apellidos"
            className={`p-2 outline-2 rounded w-full ${
              errors.lastname ? "border-red-400" : ""
            }`}
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-2">
              {errors.lastname.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo electrónico inválido",
              },
            })}
            placeholder="Correo electrónico"
            className={`p-2 outline-2 rounded w-full ${
              errors.email ? "border-red-400" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            {...register("password", {
              required: "La contraseña es obligatoria (6 a 16 caracteres)",
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres",
              },
              maxLength: {
                value: 16,
                message: "Máximo de 16 caracteres",
              },
            })}
            type="password"
            placeholder="Contraseña"
            className={`p-2 outline-2 rounded w-full ${
              errors.password ? "border-red-400" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-950 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-transform mx-auto w-50"
        >
          Registrarse
        </button>
      </form>
    </>
  );
};

export default Register;

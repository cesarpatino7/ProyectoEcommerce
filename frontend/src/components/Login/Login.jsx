import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/authService";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const navigate = useNavigate();
  const { login } = useAuth();

  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const onSubmit = async (data) => {
    try {
      setMensajeError("");
      setMensajeExito("Iniciando sesión...");

      // 4. Usamos nuestro servicio para hacer la llamada a la API
      const responseData = await authService.login(data.email, data.password);

      // 5. Si el login es exitoso, le pasamos el token a nuestro contexto global
      login(responseData.token);

      reset();
      setMensajeExito("✅ Inicio de sesión exitoso, redirigiendo...");

      // 6. Redirigimos basándonos en el rol que está DENTRO del token
      setTimeout(() => {
        const decodedToken = jwtDecode(responseData.token);
        // Super Admin -> /admin, Product Manager -> /agregar-producto, Order Manager -> home
        if (decodedToken.role === "ROLE_SUPER_ADMIN") {
          navigate("/admin");
        } else if (decodedToken.role === "ROLE_PRODUCT_MANAGER") {
          navigate("/agregar-producto");
        } else if (decodedToken.role === "ROLE_ORDER_MANAGER") {
          navigate("/");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (error) {
      setMensajeExito("");
      setMensajeError(`❌ ${error.message || "Credenciales inválidas"}`);
    }
  };

  return (
    <>
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
        <div>
          <input
            {...register("email", {
              required: "El correo electrónico es requerido",
              pattern: {
                value:
                  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/,
                message: "Correo electrónico inválido",
              },
              minLength: {
                value: 3,
                message: "Minímo 3 caracteres",
              },
              maxLength: {
                value: 40,
                message: "Máximo de 40 caracteres",
              },
            })}
            placeholder="Correo electrónico"
            name="email"
            autoComplete="email"
            className={`p-2 outline-2 rounded focus:outline-blue-400 w-full ${
              errors.email
                ? "border-red-400 outline-red-400 focus:outline-red-400"
                : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 ml-2">
              {errors.email.message}
            </p>
          )}
        </div>
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
            name="password"
            autoComplete="current-password"
            className={`p-2 outline-2 rounded focus:outline-blue-400 w-full ${
              errors.password
                ? "border-red-400 outline-red-400 focus:outline-red-400"
                : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-2 ml-2">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          className="bg-blue-950 border rounded border-blue-950 text-white font-bold py-2 px-4 hover:scale-[1.1] transition-transform cursor-pointer mx-auto w-50"
          type="submit"
        >
          Iniciar Sesión
        </button>
      </form>
    </>
  );
};

export default Login;

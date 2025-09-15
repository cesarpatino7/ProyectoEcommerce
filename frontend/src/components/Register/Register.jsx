import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
    const { register,
        handleSubmit,
        formState: { errors }, reset } = useForm({ mode: "onChange" });

    const navigate = useNavigate();
    const [mensajeExito, setMensajeExito] = useState(""); // estado para el mensaje

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: data.name,
                    apellido: data.lastname,
                    email: data.email,
                    password: data.password
                })
            });

            if (response.ok) {
                const usuario = await response.json();
                console.log("✅ Usuario registrado:", usuario);

                reset(); // limpiar formulario
                setMensajeExito("¡Registrado correctamente, de vuelta a la pagina principal...");
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                const error = await response.json();
                alert("❌ Error: " + (error.message || "No se pudo registrar"));
                reset();
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("⚠️ Error de conexión con el servidor");
        }
    };

    return (
        <>
        {mensajeExito && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded shadow">
                {mensajeExito}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-2 lg:gap-4 max-w-[500px] mx-auto">
            {/* Nombre */}
            <div>
                <input
                    {...register("name", { required: "El nombre es obligatorio", 
                        minLength: {
                        value:3,
                        message:"El mínimo es de 3 caracteres"
                    }, maxLength:{
                        value:16,
                        message:"El máximo es de 16 caracteres"
                    }})}
                    placeholder="Nombres"
                    className={`p-2 outline-2 rounded w-full ${errors.name ? "border-red-400" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
            </div>

            {/* Apellido */}
            <div>
                <input
                    {...register("lastname", { required: "El apellido es obligatorio", minLength: {
                        value:3,
                        message:"El mínimo es de 3 caracteres"
                    }, maxLength: {
                        value:16,
                        message:"El máximo es de 16 caracteres"
                    }})}
                    placeholder="Apellidos"
                    className={`p-2 outline-2 rounded w-full ${errors.lastname ? "border-red-400" : ""}`}
                />
                {errors.lastname && <p className="text-red-500 text-sm mt-2">{errors.lastname.message}</p>}
            </div>

            {/* Email */}
            <div>
                <input
                    {...register("email", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Correo electrónico inválido"
                        }
                    })}
                    placeholder="Correo electrónico"
                    className={`p-2 outline-2 rounded w-full ${errors.email ? "border-red-400" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
                <input
                    {...register("password", { required: "La contraseña es obligatoria (6 a 16 caracteres)", minLength: {
                        value: 6,
                        message:"Mínimo 6 caracteres"
                    }, maxLength:{
                        value:16,
                        message:"Máximo de 16 caracteres"
                    }})}
                    type="password"
                    placeholder="Contraseña"
                    className={`p-2 outline-2 rounded w-full ${errors.password ? "border-red-400" : ""}`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
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
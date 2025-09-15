import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Login = ()  => {
    const { register, 
        handleSubmit, 
        formState: {errors}, 
        reset}= useForm({mode:"onChange"})

    const navigate = useNavigate()
    const [mensajeError, setMensajeError] = useState("")
    const [mensajeExito, setMensajeExito] = useState("")
    
    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            })

            if (response.ok) {
                const userData = await response.json()
                localStorage.setItem("usuario", JSON.stringify(userData)) // Guarda sesión

                window.dispatchEvent(new Event('userLogin'))

                reset()
                setMensajeError("")
                setMensajeExito("✅ Inicio de sesión exitoso, redirigiendo...")
                setTimeout(() => {

                    if (userData.rol === "Administrador") {
                        navigate("/admin")
                    } else {
                        navigate("/")
                    }

                }, 1500)
            } else {
                const errorData = await response.json()
                setMensajeExito("")
                setMensajeError(/*errorData.message || */"❌ Credenciales inválidas")
            }
        } catch (err) {
            setMensajeExito("")
            setMensajeError("⚠️ Error de conexión con el servidor")
        }
    }


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
        className="mt-8 flex flex-col gap-2 lg:gap-4 max-w-[500px] mx-auto">
            <div>
                <input
                {...register("email", {
                    required:"El correo electrónico es requerido",
                    pattern: {
                        value: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/,
                        message:"Correo electrónico inválido"
                    },
                    minLength:{
                        value: 3,
                        message:"Minímo 3 caracteres"
                    },
                    maxLength:{
                        value: 40,
                        message:"Máximo de 40 caracteres"
                    }
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
                    <p className="text-red-500 text-sm mt-2 ml-2">{errors.email.message}</p>
                )}
            </div>
            <div>
                <input
                {...register("password", {
                    required:"La contraseña es obligatoria (6 a 16 caracteres)",
                    minLength:{
                        value: 6,
                        message:"Mínimo 6 caracteres"
                    },
                    maxLength:{
                        value:16,
                        message:"Máximo de 16 caracteres"
                    }
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
                {
                    errors.password && (
                        <p className="text-red-500 text-sm mt-2 ml-2">{errors.password.message}</p>
                    )
                }
            </div>

            <button className="bg-blue-950 border rounded border-blue-950 text-white font-bold py-2 px-4 hover:scale-[1.1] transition-transform cursor-pointer mx-auto w-50"
            type="submit"
            >Iniciar Sesión
            </button>
        </form>
        </>       
    )
}

export default Login
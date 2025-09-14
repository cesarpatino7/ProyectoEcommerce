import { useForm } from "react-hook-form"

const Login = ()  => {
    const { register, 
        handleSubmit, 
        formState: {errors}, 
        reset}= useForm({mode:"onChange"})

    const onSubmit = (data) => {
        console.log(data)
        reset()
    }

    return (
        <form 
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto">
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
                    required:"La contraseña es obligatoria (6 a 20 caracteres)",
                    minLength:{
                        value: 6,
                        message:"Mínimo 6 caracteres"
                    },
                    maxLength:{
                        value:20,
                        message:"Máximo de 20 caracteres"
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

            <button className="bg-primary cursor-pointer p-2 text-white font-bold"
            type="submit"
            >Iniciar Sesión
            </button>
        </form>

    )
}

export default Login
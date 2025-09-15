import { useForm } from "react-hook-form"


const Register = () => {
    const {register, 
        handleSubmit, 
        formState:{errors}, 
        reset
    } = useForm({mode:"onChange"})

    const onSubmit = (data) => {
        //Enviar los datos al backend o API
        console.log(data)
        reset()
    }


    return(
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-2 lg:gap-4 max-w-[500px] mx-auto"
        >
            <div>
                <input 
                {...register("name", {
                    required: "El nombre es obligatorio",
                    minLength:{
                        value:3,
                        message:"El mínimo es de 3 caracteres"
                    },
                    maxLength:{
                        value:16,
                        message:"El máximo es de 16 caracteres"
                    }
                })}
                className={`p-2 outline-2 rounded focus:outline-blue-400 w-full ${
                    errors.name
                    ? "border-red-400 outline-red-400 focus:outline-red-400"
                    : ""
                }`}
                autoComplete="name"
                name="name"
                placeholder="Nombres"
                type="text" />
                {
                    errors.name && (
                    <p className="text-red-500 text-sm mt-2 ml-2">{errors.name.message}</p>
                )}
            </div>
            <div>
                <input 
                {...register("lastname", {
                    required: "El apellido es obligatorio",
                    minLength:{
                        value:3,
                        message:"El mínimo es de 3 caracteres"
                    },
                    maxLength:{
                        value:16,
                        message:"El máximo es de 16 caracteres"
                    }
                })}
                className={`p-2 outline-2 rounded focus:outline-blue-400 w-full ${
                    errors.lastname
                    ? "border-red-400 outline-red-400 focus:outline-red-400"
                    : ""
                }`}
                autoComplete="lastname"
                name="lastname"
                placeholder="Apellidos"
                type="text" />
                {
                    errors.lastname && (
                    <p className="text-red-500 text-sm mt-2 ml-2">{errors.lastname.message}</p>
                )}
            </div>
            <div>
                <input
                {...register("email", {
                    required:"El correo electrónico es obligatorio",
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
            <div>
                <input 
                {...register("phonenumber", {
                    required: "El número de teléfono es obligatorio",
                    minLength:{
                        value:10,
                        message:"Debe tener 10 caracteres"
                    },
                    maxLength:{
                        value:10,
                        message:"Debe tener 10 caracteres"
                    }
                })}
                className={`p-2 outline-2 rounded focus:outline-blue-400 w-full ${
                    errors.phonenumber
                    ? "border-red-400 outline-red-400 focus:outline-red-400"
                    : ""
                }`}
                autoComplete="phonenumber"
                name="phonenumber"
                placeholder="Número de teléfono Ej: 09XX-XXX-XXX"
                type="text" />
                {
                    errors.phonenumber && (
                    <p className="text-red-500 text-sm mt-2 ml-2">{errors.phonenumber.message}</p>
                )}
            </div>
            
            <button className="bg-blue-950 cursor-pointer p-2 text-white font-bold hover:scale-[1.1] transition-transform"
            type="submit"
            >Registrarse
            </button>

        </form>
    )
}

export default Register
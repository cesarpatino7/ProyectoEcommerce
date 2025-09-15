import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)

  // Función para verificar y actualizar el usuario desde localStorage
  const checkUserFromStorage = () => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado))
      } catch (error) {
        console.error("Error al parsear usuario del localStorage:", error)
        localStorage.removeItem("usuario")
        setUsuario(null)
      }
    } else {
      setUsuario(null)
    }
  }

  // Verificar usuario al montar el componente
  useEffect(() => {
    checkUserFromStorage()
  }, [])

  // Escuchar eventos personalizados de login/logout
  useEffect(() => {
    const handleUserLogin = () => {
      checkUserFromStorage()
    }

    const handleUserLogout = () => {
      setUsuario(null)
    }

    // Agregar event listeners
    window.addEventListener('userLogin', handleUserLogin)
    window.addEventListener('userLogout', handleUserLogout)

    // Cleanup: remover listeners al desmontar
    return () => {
      window.removeEventListener('userLogin', handleUserLogin)
      window.removeEventListener('userLogout', handleUserLogout)
    }
  }, [])

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario")
    setUsuario(null)
    
    // Emitir evento de logout
    window.dispatchEvent(new Event('userLogout'))
    
    navigate("/")
  }

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center px-0 py-4 w-full">
        
        <div>
          <button 
            onClick={() => navigate("/")}
            className="btn btn-ghost text-xl text-black hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            Trucho Tienda
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          {usuario ? (
            // Usuario logueado - mostrar información y logout
            <>
              <div className="flex items-center gap-3">
                <span className="text-gray-700">
                  Hola, <span className="font-semibold text-blue-950">{usuario.nombre}</span>
                </span>
                
                {/* Dropdown menu opcional */}
                <div className="relative group">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-950 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown content */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => navigate("/perfil")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Mi Perfil
                      </button>
                      <button
                        onClick={() => navigate("/pedidos")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Mis Pedidos
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 border rounded border-red-600 text-white font-bold py-2 px-4 hover:scale-[1.05] transition-transform cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Usuario NO logueado - mostrar botones de login/registro
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-950 border rounded border-blue-950 text-white font-bold py-2 px-4 hover:scale-[1.05] transition-transform cursor-pointer"
              >
                Iniciar sesión
              </button>

              <button
                onClick={() => navigate("/register")}
                className="font-bold rounded text-blue-950 py-2 px-4 border border-blue-950 hover:scale-[1.05] transition-transform cursor-pointer"
              >
                Crear cuenta
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
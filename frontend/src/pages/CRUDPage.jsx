import { useEffect, useState } from "react"

const UsuariosAdmin = () => {
    const [usuarios, setUsuarios] = useState([])
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        rol: "Cliente",
        telefono: ""
    })
    const [modoEdicion, setModoEdicion] = useState(false)
    const [usuarioEditando, setUsuarioEditando] = useState(null)
    const [cargando, setCargando] = useState(true)

    const fetchUsuarios = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/usuarios")
            const data = await res.json()
            setUsuarios(data)
        } catch (error) {
            console.error("Error al obtener usuarios:", error)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleEditar = (usuario) => {
        setFormData({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol,
            telefono: usuario.telefono || ""
        })
        setModoEdicion(true)
        setUsuarioEditando(usuario)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!usuarioEditando) return

        try {
            const res = await fetch(`http://localhost:8080/api/v1/usuarios/${usuarioEditando.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                fetchUsuarios()
                setFormData({
                    nombre: "",
                    apellido: "",
                    email: "",
                    rol: "Cliente",
                    telefono: ""
                })
                setModoEdicion(false)
                setUsuarioEditando(null)
            } else {
                console.error("Error al actualizar usuario")
            }
        } catch (error) {
            console.error("Error de conexión:", error)
        }
    }

    const handleEliminar = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este usuario?")
        if (!confirmar) return

        try {
            const res = await fetch(`http://localhost:8080/api/v1/usuarios/${id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                fetchUsuarios()
            } else {
                console.error("Error al eliminar usuario")
            }
        } catch (error) {
            console.error("Error de conexión:", error)
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

            {modoEdicion && (
                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 max-w-md">
                    <h3 className="text-lg font-semibold">Editar Usuario</h3>
                    <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
                    <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required />
                    <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                    <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
                    <select name="rol" value={formData.rol} onChange={handleChange}>
                        <option value="Cliente">Cliente</option>
                        <option value="Administrador">Administrador</option>
                    </select>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                            Actualizar
                        </button>
                        <button type="button" onClick={() => {
                            setModoEdicion(false)
                            setUsuarioEditando(null)
                            setFormData({
                                nombre: "",
                                apellido: "",
                                email: "",
                                rol: "Cliente",
                                telefono: ""
                            })
                        }} className="bg-gray-400 text-white py-2 px-4 rounded">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {cargando ? (
                <p>Cargando usuarios...</p>
            ) : (
                <table className="w-full border">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Apellido</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Rol</th>
                        <th className="p-2 border">Teléfono</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} className="border-t">
                            <td className="p-2 border">{u.nombre}</td>
                            <td className="p-2 border">{u.apellido}</td>
                            <td className="p-2 border">{u.email}</td>
                            <td className="p-2 border">{u.rol}</td>
                            <td className="p-2 border">{u.telefono || "—"}</td>
                            <td className="p-2 border">
                                <button onClick={() => handleEditar(u)} className="text-blue-600 mr-2">Editar</button>
                                <button onClick={() => handleEliminar(u.id)} className="text-red-600">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default UsuariosAdmin

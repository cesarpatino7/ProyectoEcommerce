import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="mb-8">
      <div className="py-8 flex justify-center items-center gap-4">
        <Link to={"/register"} className="font-semibold py-2 px-4 border hover:scale-[1.1] transition-transform
        cursor-pointer">Crear cuenta</Link>
        <div className="divider">|</div>
        <Link to={"/login"} className="font-semibold py-2 px-4 border hover:scale-[1.1] transition-transform
        cursor-pointer">Iniciar sesión</Link>
      </div>
<nav className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <div>
      <Link to={"/home"} className="btn btn-ghost text-xl">Punto Tienda</Link>
    </div>
  </div>

</nav>
    </header>
  );
};

export default Navbar;
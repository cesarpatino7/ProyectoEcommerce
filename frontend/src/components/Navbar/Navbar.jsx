import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="mb-8">
      <div className="flex justify-between items-center px-0 py-4 w-full">
        
        <div>
          <Link to={"/"} className="btn btn-ghost text-xl text-black">
            Trucho Tienda
          </Link>
        </div>
        

        <div className="flex items-center gap-4 ">
          <Link
            to={"/login"}
            className="bg-blue-950 border rounded border-blue-950 text-white font-bold py-2 px-4 hover:scale-[1.05] transition-transform cursor-pointer"
          >
            Iniciar sesión
          </Link>

           <Link
            to={"/register"}
            className="font-bold rounded text-blue-950 py-2 px-4 border hover:scale-[1.05] transition-transform cursor-pointer"
          >
            Crear cuenta
          </Link>
          
        </div>
      </div>
    </header>
  );
};

export default Navbar;
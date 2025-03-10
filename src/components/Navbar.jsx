import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">Mi Aplicación</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Inicio</Link>
        <Link to="/simulacion" className="hover:underline">Simulación</Link>
      </div>
    </nav>
  );
}

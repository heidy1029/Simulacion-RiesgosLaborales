import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800">Bienvenido a la Plataforma</h1>
      <p className="text-gray-600 mt-2">Explora nuestras simulaciones y juegos educativos.</p>
      <Link to="/juegos" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
        Ver Juegos
      </Link>
    </div>
  );
}

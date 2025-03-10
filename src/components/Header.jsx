import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUserFriends, FaList } from "react-icons/fa";
import logo from "../assets/logo.png";
import onboardingImage from "../assets/onbording.jpeg";
import incendioImage from "../assets/incendio.jpeg";
import sismoImage from "../assets/sismo.jpeg";
import rankingImage from "../assets/Ranking.png"; //

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Home");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    // Aquí puedes agregar la lógica para cerrar sesión
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 flex flex-col justify-between">
        <div>
          <div className="text-center mb-6">
            <img src={logo} alt="Logo" className="mx-auto mb-2 w-16 h-16" />
            <h1 className="text-xl font-bold text-[#FF6600]">RISK FREE GAME</h1>
          </div>
          <nav>
            <ul>
              <li className={`flex items-center p-3 cursor-pointer ${activePage === "Home" ? "text-[#FF6600]" : "text-gray-600"}`} onClick={() => setActivePage("Home")}>
                <FaHome className="mr-2" /> Home
              </li>
              <li className={`flex items-center p-3 cursor-pointer ${activePage === "Simulaciones" ? "text-[#FF6600]" : "text-gray-600"}`} onClick={() => setActivePage("Simulaciones")}>
                <FaList className="mr-2" /> Simulaciones
              </li>
              <li className={`flex items-center p-3 cursor-pointer ${activePage === "Usuarios" ? "text-[#FF6600]" : "text-gray-600"}`} onClick={() => setActivePage("Usuarios")}>
                <FaUserFriends className="mr-2" /> Panel de usuarios
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-black text-white p-4 flex justify-between items-center relative">
          <h2 className="text-xl font-semibold">{activePage}</h2>
          <div className="relative">
            <button 
              className="bg-white text-black p-2 rounded-md" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Jhon Doe ▼
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md p-2">
                <button 
                  className="w-full text-left p-2 hover:bg-gray-200 rounded-md"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6 bg-[#FEF3EB] relative">
        {activePage === "Home" && (
            <section className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-600">Resumen</h3>
              <div className="flex space-x-4 mt-2">
              {[
                { name: "Onboarding", img: onboardingImage },
                { name: "Incendio", img: incendioImage },
                { name: "Simulacro", img: sismoImage }
              ].map((item, index) => (
                <div key={index} className="w-1/3 bg-white shadow-md p-4 rounded-md flex flex-col items-center">
                  <img src={item.img} alt={item.name} className="w-full rounded-md" />
                  <div className="flex items-center justify-between w-full mt-2">
                    <button className="bg-[#FF6600] text-white p-2 rounded-md flex-1 mr-2">{item.name}</button>
                    <input type="range" className="w-3/4 bg-[#F9672F] appearance-none h-2 rounded-md" min="0" max="100" />
                  </div>
                </div>
              ))}
              </div>
                 {/* Ranking con imagen */}
                 <div className="flex mt-6 items-center">
                <section className="bg-white p-6 rounded-lg shadow-md w-2/3">
                  <h2 className="text-lg font-bold mb-4">Ranking</h2>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">Posición</th>
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Simulación</th>
                        <th className="p-2">Calificación</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">1</td>
                        <td className="p-2">Juan Pérez</td>
                        <td className="p-2">Incendio</td>
                        <td className="p-2">95%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">2</td>
                        <td className="p-2">Ana Gómez</td>
                        <td className="p-2">Onboarding</td>
                        <td className="p-2">90%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">3</td>
                        <td className="p-2">Carlos López</td>
                        <td className="p-2">Simulacro</td>
                        <td className="p-2">85%</td>
                      </tr>
                    </tbody>
                  </table>
                </section>
                <div className="w-1/3 pl-6">
                  <img src={rankingImage} alt="Ranking Visual" className="rounded-lg shadow-md" />
                </div>
              </div>
            </section>
          )}


{activePage === "Simulaciones" && (
            <section className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-600">Simulaciones Disponibles</h3>
              <div className="space-y-4 mt-4">
              {[
                { name: "Onboarding", img: onboardingImage },
                { name: "Incendio", img: incendioImage },
                { name: "Simulacro", img: sismoImage }
              ].map((item, index) => (
                  <div key={index} className="bg-white shadow-md p-4 rounded-md flex items-center">
                    <img src={item.img} alt={item.name} className="w-1/4 rounded-md mr-4" />
                    <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
                      <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <button className="bg-[#FF6600] text-white mt-2 p-2 rounded-md">Empezar</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}
             {activePage === "Usuarios" && (
              <section>
                <h3 className="text-lg font-semibold text-gray-600">Gestión de Usuarios</h3>
                <p>Aquí iría el contenido del panel de usuarios...</p>
              </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

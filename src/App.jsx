import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MenuJuegos from "./components/MenuJuegos";
import Home from "./Home";
import { fetchDataListaJuegos } from "./utils/data";

const idMenuJuegos = [
  { "oid": 1, "nombre": "Ahorcado con Imagen" },
  { "oid": 2, "nombre": "Ahorcado con Pregunta" },
  { "oid": 3, "nombre": "Rompecabezas" },
  { "oid": 4, "nombre": "Adivinanza Pregunta" },
  { "oid": 5, "nombre": "Adivinanza Imagen" },
  { "oid": 6, "nombre": "Ruleta-Pregunta-Unica" },
  { "oid": 7, "nombre": "Ruleta-Imagen-Unica" },
  { "oid": 8, "nombre": "Ruleta-Pregunta-multiple" },
  { "oid": 9, "nombre": "Ruleta-Imagen-multiple" },
  { "oid": 10, "nombre": "Adivinanza-(Trivia Pregunta)-multiple" },
  { "oid": 11, "nombre": "Adivinanza-(Trivia Imagen)-multiple" },
  { "oid": 12, "nombre": "Busca las parejas" },
  { "oid": 13, "nombre": "Sopa de letras" },
  { "oid": 14, "nombre": "Tres en raya" },
  { "oid": 15, "nombre": "Sudoku" },
  { "oid": 16, "nombre": "Crucigrama" },
];

export default function App() {
  const [availableItems, setAvailableItems] = useState([]);

  useEffect(() => {
    (async () => {
      const todosJuegos = await fetchDataListaJuegos();
      localStorage.setItem("todosJuegos", JSON.stringify(todosJuegos));
      
      var uniqs = todosJuegos.reduce((acc, item) => {
        acc[item.tipoJuego] = (acc[item.tipoJuego] || 0) + 1;
        return acc;
      }, {});

      var allIds = Object.keys(uniqs).map(Number);

      // Filtrar los id disponibles
      const filtrarIds = idMenuJuegos.filter((game) => allIds.includes(game.oid));

      // Resultado
      const result = filtrarIds.map(({ oid, nombre }) => ({ oid, nombre }));
      localStorage.setItem("actividadesDisponibles", JSON.stringify(result));
      setAvailableItems(result);
    })();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header disponibles={availableItems} />
      <main className="grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/juegos" element={<MenuJuegos items={availableItems} display="cards" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
  
}

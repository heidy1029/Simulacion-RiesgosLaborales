import React, { useContext, useEffect, useRef, useState, useCallback } from "react";

import "./index.css"
import initCrosswordGame from "./ttsciihuy";
import { GameContext } from "../../Juegos";

const Crucigrama = () => {
  const { data, moves, handleMoves, setWinner, boardSize, handleWinPoints } = useContext(GameContext);
  const crossword = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log(data)
  useEffect(() => {
    


    // Solo intentar inicializar si tenemos datos válidos
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      setIsLoading(true);
      setError(null);

      try {        
        setIsLoading(false);
        // Inicializar el juego
        initCrosswordGame(data);
        // Configurar la función externa
        window.externalFunction = (valor) => {
          handleMoves(moves - valor);
          if (moves - valor < 1) {
            handleMoves(data.errores);
            window.wordIncorrect = 0;
          }
        };

        

      } catch (err) {
        setError("Error al inicializar el crucigrama");
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      setError("Esperando datos del crucigrama...");
    }
  }, []);

   useEffect(() => {
        // Agregar el listener cuando el componente se monta
        const handleCrosswordComplete = (event) => {
            // Aquí puedes manejar la victoria
            console.log('¡Crucigrama completado!');
            handleWinPoints(true)
            // Aquí puedes llamar a tus funciones de victoria
        };

        document.addEventListener('crosswordCompleted', handleCrosswordComplete);

        // Limpiar el listener cuando el componente se desmonta
        return () => {
            document.removeEventListener('crosswordCompleted', handleCrosswordComplete);
        };
    }, []);

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Cargando crucigrama...</p>
      </div>
    );
  }

  return(
    <>
      <div id="ttscontainer">
        <div id="crossword" style={{width: boardSize.width, height: boardSize.height}}></div>
      </div>
    </>
  )
}
export default Crucigrama
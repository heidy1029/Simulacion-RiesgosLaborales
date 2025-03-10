import Header from "./components/Header"
import Footer from "./components/Footer"
import { createContext, useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import { fetchData, fetchDataListaJuegos } from "./utils/data"

// componentes juegos
import Roulette from "./components/roulette/Roulette"
import Trivia from "./components/trivia/Trivia"
import TriviaMultiple from "./components/triviaMultiple/TriviaMultiple"
import Hangman from "./components/hangman/Hangman"
import SlidingPuzzle from "./components/puzzle-deslizante/SlidingPuzzle"
import VidasMovimientos from "./components/VidasMovimientos"
import Pregunta from "./components/Pregunta"
import GanasteModal from "./components/GanasteModal"
import FallasteModal from "./components/FallasteModal"
import FinalizasteModal from "./components/FinalizasteModal"
import Crucigrama from "./components/crucigrama/Crucigrama"
import WordList from "./components/WordList"
import WordSearch from "./components/wordSearch/WordSearch"
import MemoramaCartas from "./components/memorama-cartas/MemoramaCartas"
import TresEnLinea from "./components/tres-en-linea/Board"

export const GameContext = createContext();
let cont = 0;
export default function Juegos() {

  const { tipoJuego, oidJuego, oidUsuario } = useParams();
  const [ lostAttempts, setLostAttempts ] = useState(0);
  const [ moves, setMoves ] = useState(0);
  const [ gameStatus, setGameStatus ] = useState('playing');

  const [ boardSize, setBoardSize ] = useState({ width:0, height:0});
  const gameColumnRef = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [listSopa, setListSopa] = useState([]);
  const [winPoint, setWinPoint] = useState(false);
  const [ultimo, setUltimo] = useState({});
  const [penultimo, setPenultimo] = useState({});

  const navigate = useNavigate(); 

  function setGameComponent () {
    let game = null;
    switch (tipoJuego) {
      case "1":case "2": game = <Hangman />;break;
      case "3": game = <SlidingPuzzle />;break;
      case "4":case "5": game = <Trivia /> ;break;
      case "6":case "7":case "8":case "9": game = <Roulette />;break;
      case "10":case "11": game = <Trivia />;break;
      case "12": game = <MemoramaCartas />;break;
      case "13": game = <WordSearch />;break;
      case "14": game = <TresEnLinea />;break;
      case "16": game = <Crucigrama />;break;
      default:break;
    }
    return game;
  }

  function handleMoves(totalMoves,hasWon) {
    setMoves(totalMoves);
    if(totalMoves === 0){
      cont = cont + 1;
      setLostAttempts(prev => prev + 1);
      if(cont === data.intentos)setGameStatus('fallaste')
    }
    if(moves === 1){
      setLostAttempts(lostAttempts + 1);
      if(lostAttempts === data.intentos - 1 )setGameStatus('fallaste');
    }
    if(hasWon)setGameStatus('ganaste');
  } 

  function setWinner(){
    setGameStatus("ganaste");
  }

  // Data fetch API
  // Reiniciar el estado cuando cambia la ruta
  useEffect(() => {
    const resetGameState = () => {
      setData({});
      setLostAttempts(0);
      setMoves(0);
      setGameStatus("playing");
      setPhotoUrl("");
      setError(null);
      cont = 0; // Reiniciar el contador global
    };

    resetGameState();
    
    const fetchGameData = async () => {
      setLoading(true);
      try {
        const dataObj = await fetchData(oidJuego, oidUsuario);
        if (dataObj.error) {
          setError(dataObj.error);
        } else {
          setData(dataObj);
          setMoves(dataObj.errores);
          setPhotoUrl(dataObj.url || null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [location.pathname, oidJuego, oidUsuario]); 

  //console.log(data)
  
  // set responsive board game size
  useEffect(() => {
    const handleResize = () => {
      if(gameColumnRef.current){
        const { width, height } = gameColumnRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(gameColumnRef.current);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const size= width < height - paddingTop ? width : height - paddingTop;
        setBoardSize({width:size, height:size});
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[]);

  // modal estado del juego
  useEffect(() => {
    let modal = '';
    console.log(gameStatus)
    switch (gameStatus) {
      case 'ganaste':modal='ganasteModal';break;
      case 'fallaste':modal='fallasteModal';break;
      case 'finalizaste':modal='finalizasteModal';break;    
      default:break;
    }
    if(modal !== '')document.getElementById(modal).showModal();
    console.log('gameStatus: '+gameStatus);
  }, [gameStatus]);


  useEffect(() => {
    (async() => {
      const todosJuegos = await JSON.parse(localStorage.getItem("todosJuegos"));
      const juegos = todosJuegos.filter(juego => juego.tipoJuego === parseInt(tipoJuego));

      const getSomeElements = juegos.map(element => {
        return {
          oidJuego: element.oidJuego,
          tipoJuego: element.tipoJuego
        }
      });
      let ArregloOrdenado = getSomeElements.sort((a, b) => a.oidJuego - b.oidJuego);

      localStorage.setItem("listIdPresentGame", JSON.stringify(ArregloOrdenado));
    })()
  }, [tipoJuego]);

  useEffect(() => {
  if (winPoint) {
    console.log("Penúltimo:", penultimo);
    console.log("Último:", ultimo);

    if (ultimo && parseInt(oidJuego) === ultimo.oidJuego) {
      // Evaluar primero si es el último
      setGameStatus("finalizaste");
    } else if (penultimo && parseInt(oidJuego) === penultimo.oidJuego) {
      // Si no es el último, verificar si es el penúltimo
      setGameStatus("ganaste");
    } else {
      // Manejo para otros juegos
      setWinner();
    }
  }
}, [winPoint]);



  const handleNextGame = (e) => {
      e.preventDefault();

      const dataUrlsPresentGame = JSON.parse(localStorage.getItem("listIdPresentGame"));
      if (!dataUrlsPresentGame) {
        console.error("No se encontró el arreglo en localStorage.");
        return;
      }

      // Actualizar estado de juegos
      const updatedGames = dataUrlsPresentGame.map((game) =>
        game.oidJuego === parseInt(oidJuego) ? { ...game, completado: true } : game
      );

      // Guardar juegos actualizados
      localStorage.setItem("listIdPresentGame", JSON.stringify(updatedGames));

      // Filtrar juegos incompletos
      const incompletos = updatedGames.filter((game) => !game.completado).sort((a, b) => a.oidJuego - b.oidJuego);

      let val1 = incompletos[incompletos.length - 2];
      let val2 = incompletos[incompletos.length - 1]
      // Actualizar referencias de penúltimo y último juego
      setPenultimo(val1);
      setUltimo(val2);

      // Obtener próximo juego
      const mayores = incompletos.filter((game) => game.oidJuego > oidJuego);
      const menores = incompletos.filter((game) => game.oidJuego < oidJuego);
      const nextGame = mayores.length > 0 ? mayores[0] : menores[0];

    // Navegar al siguiente juego o finalizar
    if (nextGame) {
      document.getElementById("ganasteModal").close();
      document.getElementById("fallasteModal").close();
      setWinPoint(false)
      navigate(`/juegos/${tipoJuego}/${nextGame.oidJuego}/${oidUsuario}`);
    } else {
      handleLoLograste()
      localStorage.removeItem("listIdPresentGame");
      navigate("/");
    }
  };

  const handleLoLograste = () => {
    document.getElementById("finalizasteModal").showModal();
  }

  const handleWinPoints = (value) => {
    setWinPoint(value)
  }
  
  return (
    <div className="flex flex-col justify-between flex-nowrap items-center min-h-screen md:min-h-px md:h-screen overflow-x-hidden">
      <Header />
      <main className="grow w-full flex flex-col">

        <header className="w-full bg-gris-claro-azul py-2">
          <div className="container mx-auto text-center">
            <h1 className="text-secondary text-3xl capitalize">
              
            </h1>
          </div>
        </header>

        <section className="grow container mx-auto flex flex-col md:flex-row xl:justify-start space-x-0 md:space-x-12 space-y-8 md:space-y-0 px-4 lg:px-16 xxl:px-0 pb-12">
          {/* info */}
          <div className="w-full md:w-1/2 h-full 2xl:h-2/3 flex flex-col space-y-6 md:space-y-14 justify-between items-center">
            <VidasMovimientos vidas={data.intentos} errores={lostAttempts} movimientos={moves} />
            {
              tipoJuego == 13 ? (
                <div className={`bg-gris-claro-azul rounded-3xl w-full h-2/3 max-h-max xl:max-h-full p-6 md:p-12 justify-center flex flex-col items-center ${loading && 'skeleton'}`}>
                  <WordList wordlist={listSopa} />
                </div>
              )
              : <Pregunta pregunta={data.pregunta} isLoading={loading} photo={photoUrl} />
            }            
          </div>

          {/* juego */}
          <div ref={gameColumnRef} className="w-full md:w-1/2 min-h-[100vw] md:min-h-0 md:h-full 2xl:h-2/3 flex justify-center md:items-center md:pt-12">
            <div className={`relative aspect-square ${loading ? 'skeleton':''} flex flex-col justify-center`} style={{width:boardSize.width+'px',height:boardSize.height+'px'}}>
              <GameContext.Provider value={{data, moves, handleMoves, boardSize, setWinner, setListSopa, handleWinPoints, setMoves}}>
                {Object.entries(data).length > 0 ? setGameComponent() : <h2>{error}</h2>}
              </GameContext.Provider>
            </div>
          </div>
        </section>

        {/* modals */}
        <GanasteModal puntos={data.puntos} handleNextGame={handleNextGame} />
        <FallasteModal handleNextGame={handleNextGame} />
        <FinalizasteModal />

      </main>
      <Footer />
    </div>
  )
}
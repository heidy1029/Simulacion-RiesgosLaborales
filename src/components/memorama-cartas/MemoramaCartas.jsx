import { useContext, useEffect, useState } from "react"
import { GameContext } from "../../Juegos"
import { Card } from './Card';
import './memoramacards.css'


const shuffleArray = (array) => {
  for(let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default function MemoramaCartas() {
  const { data, moves, handleMoves, boardSize, setWinner, setMoves } = useContext(GameContext);
  
  const imgs = data.respuesta;
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errores, setErrores] = useState(3);

  const createBoard = () => {
    setErrores(data.errores);
    const imgsConId = imgs.map((img, i) => {
        return {...img,id: i}}
    );
    const duplicatecards = imgsConId.flatMap((img) => {
          const duplicate = {
              ...img,
              id: img.id + imgs.length
          }
          return [img, duplicate]
    });
    const newCards = shuffleArray(duplicatecards)
    const cards = newCards.map((card, i) => {
        return {
            ...card,
            flipped: false,
            matched: false,
            index:i
        };
    });
    setCards(cards);
}

useEffect(() => {
    createBoard();
}, []);
useEffect(() => {
    if(errores < 1){
        document.getElementById("fallasteModal").showModal();
    }
}, [errores]);

const handleCardClick = (id) => {
    if(isDisabled) return;


    const [currentCard] = cards.filter(card => card.id === id)

    if(!currentCard.flipped && !currentCard.matched) {
        currentCard.flipped = true;

        const newFlippedCards = [...flippedCards, currentCard];
        setFlippedCards(newFlippedCards);


        if(newFlippedCards.length === 2) {
            setIsDisabled(true);
            const [firstCard, secondCard] = newFlippedCards

            //console.log(firstCard.img, secondCard.img)
            if(firstCard.ruta === secondCard.ruta) {
                firstCard.matched = true;
                secondCard.matched = true;
                setIsDisabled(false);
            } else{
                setTimeout(() => {
                    firstCard.flipped = false;
                    secondCard.flipped = false;
                    setCards(cards);
                    setIsDisabled(false);
                }, 1000);
                if(moves < 2){
                    handleMoves(data.errores)
                    setErrores(prev => prev - 1);
                } else handleMoves(prev => prev-1);
            }
            setFlippedCards([]);
            // setMoves(moves + 1);
        }

        setCards(cards);
    }
    if(cards.every(card => card.matched) ){
        setGameOver(true);
        setIsDisabled(true);
        setWinner();
    }
};

const handleNewGame = () => {
  setCards([]);
  createBoard();
  setMoves(data.errores);
  setGameOver(false);
  setIsDisabled(false);
}

return (
<>
    <div className='mx-auto flex flex-col justify-center items-center'>          
        <div className='grid grid-cols-4 gap-3 justify-center items-center px-3 py-5 my-3'>
            {cards.map(card => (
                <Card card={card} key={card.id} handleCardClick={handleCardClick} />
            ))}
        </div>
        <button className='btn btn-accent font-bold uppercase text-white' onClick={handleNewGame}>
            Nuevo Juego
        </button>
    </div>        
</>
)
}

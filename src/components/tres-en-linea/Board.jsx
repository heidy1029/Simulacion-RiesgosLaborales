import { useContext, useState } from 'react'
import confetti from 'canvas-confetti'

import { Square } from './Square.jsx'
import { TURNS, saveGameToStorage, resetGameStorage, checkWinnerFrom, checkEndGame } from './helpers.js'
import { WinnerModal } from './WinnerModal.jsx'
import { GameContext } from '../../Juegos';

import './board.css'

function Board() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });
  const {data, moves, handleMoves, setWinner: ganador} = useContext(GameContext);
  //console.log(data);

  const [winner, setWinner] = useState(null);
  const [isUserTurn, setIsUserTurn] = useState(true); // Nuevo estado para controlar el turno del usuario

  const resetGame = () => {
    setTurn(TURNS.X);
    setBoard(Array(9).fill(null));
    setIsUserTurn(true); // Al reiniciar, siempre empieza el usuario
    resetGameStorage();
  };
  let terminaPartida = false;
  const updateBoard = (index) => {
    if (!isUserTurn || board[index] || winner) return; // Bloquear si no es el turno del usuario

    let newBoard = [...board];
    newBoard[index] = turn; // Marcar con el turno actual
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    saveGameToStorage({ board: newBoard, turn: newTurn });

    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      ganador()
      confetti();
      resetGame()
      console.log(newWinner) // GANA X
    } else if (checkEndGame(newBoard)) {
      terminaPartida = true;
      resetGame();
    } else if (newTurn === TURNS.O) {
      setIsUserTurn(false); // Bloquear el turno del usuario
      setTimeout(() => machineMove(newBoard), 800); // La máquina hace su movimiento
    }

    setTurn(terminaPartida ? TURNS.X : newTurn);
  };

  const machineMove = (currentBoard) => {
    // Lógica de la máquina (como en el ejemplo anterior)
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const findBestMove = (board, turn) => {
      for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        const values = [board[a], board[b], board[c]];

        if (
          values.filter((val) => val === turn).length === 2 &&
          values.includes(null)
        ) {
          return combo[values.indexOf(null)];
        }
      }
      return null;
    };

    let bestMove = findBestMove(currentBoard, TURNS.O) || findBestMove(currentBoard, TURNS.X);

    if (bestMove === null && currentBoard[4] === null) {
      bestMove = 4;
    }

    if (bestMove === null) {
      const corners = [0, 2, 6, 8];
      bestMove = corners.find((corner) => currentBoard[corner] === null);
    }

    if (bestMove === null) {
      const availableMoves = currentBoard
        .map((square, idx) => (square === null ? idx : null))
        .filter((idx) => idx !== null);

      if (availableMoves.length > 0) {
        bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    }

    if (bestMove !== null) {
      const newBoard = [...currentBoard];
      newBoard[bestMove] = TURNS.O;
      setBoard(newBoard);

      const newTurn = TURNS.X;
      saveGameToStorage({ board: newBoard, turn: newTurn });

      const newWinner = checkWinnerFrom(newBoard);
      if (newWinner) {
        confetti();
        handleMoves(val => val-1);
        resetGame()
        //GANA O
      } else if (checkEndGame(newBoard)) {
        resetGame();
      } else {
        setIsUserTurn(true); // Reactivar el turno del usuario
      }

      setTurn(newTurn);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <main className="board">
        <button onClick={resetGame}>adasd</button>
        <section className="game">
          {board.map((square, index) => (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
              isDisabled={!isUserTurn || !!board[index]} // Deshabilitar casillas si no es turno del usuario o están ocupadas
            >
              {square}
            </Square>
          ))}
        </section>
        <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>
      </main>
    </div>
  )
}

export default Board

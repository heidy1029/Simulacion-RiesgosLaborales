import React, { useEffect, useCallback, createContext, useContext } from "react";
import { useSearchParams } from 'react-router-dom';
import Gameboard from "./WordSearch/components/Gameboard";
import "./wordsearch.css"
import { useState } from "react";
import { GameContext } from "../../Juegos";

const SIZE_VALIDATION_REGEX = /^[1-2]?[0-9]\*[1-2]?[0-9]$/s;
const DEFAULT_SIZE = [10, 10];

export const WordSearchContext = createContext();

const WordSearch = ({vidas = 3, movimientos}) => {
  const {moves, handleMoves, data} = useContext(GameContext)
  const [query, setQuery] = useSearchParams({ size: '10*10' });
  const [listal, setListaL] = useState([]);
  /*const [moves, setMoves] = useState(10);*/
  const [vueltasCorazon, setVueltasCorazon] = useState(3);

  useEffect(() => {
    setVueltasCorazon(data.intentos)
  }, [])  

  const error = console.error;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  const getValidSize = useCallback(() => {
    const _size = query.get('size')?.trim();
    return !_size || !SIZE_VALIDATION_REGEX.test(_size) ? DEFAULT_SIZE.join('*') : _size;
  }, [query]);

  useEffect(() => {
    setQuery(
      (prev) => {
        return { ...prev, size: getValidSize() };
      },
      { replace: true }
    );
  }, [getValidSize, setQuery]);

  const size = getValidSize().split('*');

  const getListWord = (data) => setListaL(data);

  useEffect(() => {
    if(moves == 0 && vueltasCorazon >= 1){
      handleMoves(data.errores);
      setVueltasCorazon(prev => prev - 1);
    }

    if(vueltasCorazon === 0){
      handleMoves(0)
    }
  }, [moves]);

  return(
    <WordSearchContext.Provider value={{getListWord, listal, handleMoves}}>
      <Gameboard size={size} getListWord={getListWord} />
    </WordSearchContext.Provider>
  )
}
export default WordSearch
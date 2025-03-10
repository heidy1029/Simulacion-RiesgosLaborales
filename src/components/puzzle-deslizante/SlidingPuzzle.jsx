import { useContext, useEffect, useState, useRef } from "react"
import PropTypes from 'prop-types'
import Tile from "./Tile"
import { canSwap, shuffle, swap, isSolved } from "./helpers"
import { GameContext } from "../../Juegos"
import "./slidingpuzzle.css"

function SlidingPuzzle({ grid = 3 }) {
    const { data, moves, handleMoves, boardSize, setWinner } = useContext(GameContext);

    const tileCount = grid ** 2;
    const [boardWidth, setBoardWidth] = useState(boardSize.width);
    const [boardHeight, setBoardHeight] = useState(boardSize.height);
    const [tiles, setTiles] = useState([...Array(tileCount).keys()]);
    const [isStarted, setIsStarted] = useState(false);
    const puzzle = useRef(null);

    const shuffleTiles = () => {
        if(puzzle.current !== null){
            const shuffledTiles = shuffle(tiles, tileCount);
            setTiles(shuffledTiles);
            handleMoves(data.errores);
        }
    }

    const swapTiles = (tileIndex) => {
        if (!hasWon && (moves > 0) && canSwap(tileIndex, tiles.indexOf(tiles.length - 1), grid)) {
            const swappedTiles = swap(tiles, tileIndex, tiles.indexOf(tiles.length - 1))
            setTiles(swappedTiles)
            handleMoves(moves - 1);
        }
    }

    const handleTileClick = (index) => swapTiles(index);

    const handleShuffleClick = () => shuffleTiles();

    const handleStartClick = () => {
        shuffleTiles();
        setIsStarted(true);
    }

    const hasWon = isSolved(tiles);

    useEffect(() => {
        if(hasWon && isStarted){
            console.log('ganaste');
            setWinner();
        }
    }, [tiles, hasWon])
    
    useEffect(() => {
        setBoardWidth(boardSize.width);
        setBoardHeight(boardSize.height);
    }, [boardSize]);

    return (
        <>
            <div ref={puzzle} className="board-grid" style={{ width: boardWidth + 'px', height: boardHeight + 'px' }}>
                {tiles.map((tile, index) => (
                    <Tile
                        key={tile}
                        index={index}
                        tile={tile}
                        tileCount={tileCount}
                        width={boardWidth / grid}
                        height={boardHeight / grid}
                        gridSize={grid}
                        imgTile={data.url.replaceAll(' ','%20')}
                        handleTileClick={handleTileClick}
                    />
                ))}
            </div>
            <div className="absolute bottom-0 right-0 board-footer w-full">
                {!isStarted && <button className="btn btn-accent btn-circle absolute bottom-0 right-0 w-20 h-20 text-primary uppercase font-bold" onClick={() => handleStartClick()}>Jugar</button>}

                {moves === 0 && !hasWon &&
                    <div role="alert" className="alert alert-warning">
                        <span>¡Has alcanzado el número máximo de movimientos permitidos!</span>
                        <button className="btn btn-info text-white font-bold uppercase" onClick={() => handleShuffleClick()}>Comenzar de nuevo</button>
                    </div>
                }
            </div>
        </>
    )
}

SlidingPuzzle.propTypes = {
    grid: PropTypes.number
}

export default SlidingPuzzle

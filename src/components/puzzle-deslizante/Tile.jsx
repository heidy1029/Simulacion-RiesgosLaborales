import PropTypes from 'prop-types';
import { getMatrixPosition, getVisualPosition } from "./helpers";

function Tile(props) {
    const { tile, tileCount, index, width, height, imgTile, gridSize, handleTileClick } = props;

    const boardPadding = 1;
    const tileWidth = Math.floor(width) - boardPadding;
    const tileHeight = Math.floor(height) - boardPadding;

    const { row, col } = getMatrixPosition(index, gridSize);
    const visualPos = getVisualPosition(row, col, width, height);

    const tileStyle = {
        width: `${tileWidth}px`,
        height: `${tileHeight}px`,
        transform: `translate(${visualPos.x}px, ${visualPos.y}px)`,
        backgroundImage: `url(${imgTile})`,
        backgroundSize: `${width * gridSize}px`,
        backgroundPosition: `${(100 / (gridSize - 1)) * (tile % gridSize)}% ${(100 / (gridSize - 1)) * (Math.floor(tile / gridSize))}%`
    }

    return (
        <div className={`tile ${tile + 1} index ${index}`}
             style={{...tileStyle, opacity: tile === tileCount - 1 ? 0 : 1}}
             onClick={() => handleTileClick(index)}
        >
            <span className="tile-number opacity-0">{tile + 1}</span>
        </div>
    )
}

Tile.propTypes = {
    tile: PropTypes.number,
    tileCount: PropTypes.number,
    index: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    imgTile: PropTypes.string,
    gridSize: PropTypes.number,
    handleTileClick: PropTypes.func
}

export default Tile
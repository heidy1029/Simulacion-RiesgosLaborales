import Wordlist from './wordlist';
import { randomInt, clamp } from './helperFunctions';

const MAX_SIZE = 20;
const MIN_SIZE = 5;

export default function createPuzzle(width = 11, height = 11, data, wordCount = Infinity) {
  height = clamp(height, MIN_SIZE, MAX_SIZE)
  width = clamp(width, MIN_SIZE, MAX_SIZE)
  const charLimit = clamp(Math.min(height, width) - 2, 4, MAX_SIZE - 2)
  const listSize = Math.min(height, width, wordCount)
  // create word list
  let wordlist = createAWordList(listSize, charLimit, data)
  // create empty table matrix
  const table = createTableArray(height, width);
  // place words
  placeWords(table, wordlist, height, width)
  // fill empty cells with random letters
  fillEmptyCells(table)
  return [table, wordlist];
}

function createAWordList(size, charLimit, data) {
  console.log(data)
  let wordlist = [];
  const _wordlist = data.respuesta
    .map(resp => resp.palabra)
    .filter(w => w.length <= charLimit);

  size = Math.min(_wordlist.length, Math.abs(size))
  for (let i = 0; i < size; i++) {
    const length = _wordlist.length;
    if (length === 0) break;
    // pick random words
    const index = randomInt(length)
    wordlist.push(_wordlist[index])
    // avoid duplication
    _wordlist.splice(index, 1)
  }
  return wordlist.map((word, i) => { return { value: word, found: false, index: i } });
}

function createTableArray(height, width) {
  const table = new Array(height).fill(0).map(() => {
    return new Array(width).fill(0)
  })

  return table
}



function placeWords(table, wordlist, height, width) {
  const directions = [
    { name: "hor", x: 0, y: 1, check: (l, x, y) => y <= (width - l) },
    { name: "ver", x: 1, y: 0, check: (l, x, y) => x <= (height - l) },
    { name: "diag", x: -1, y: 1, check: (l, x, y) => x >= l && y <= (width - l) },
    { name: "diag-", x: 1, y: 1, check: (l, x, y) => x <= (height - l) && y <= (width - l) }];

  const sortedWordlist = [...wordlist].sort((a, b) => a.value.length - b.value.length)
  for (let i = 0; i < sortedWordlist.length; i++) {
    const word = sortedWordlist[i].value.toLowerCase();
    let cell, dir;
    let empty = true
    const openset = getOpenset(height, width, word.length);

    do {
      if (openset.length <= 0) {
        wordlist.splice(sortedWordlist[i].index, 1)
        console.log(i, word)
        break;
      }
      const cellIndex = randomInt(openset.length)
      cell = openset[cellIndex]

      const dirIndex = getDirIndex(cell, height, width);

      for (let _j = 0; _j < directions.length; _j++) {
        const j = (_j + dirIndex) % directions.length
        dir = directions[j]
        empty = isEmpty(table, word, dir, cell.x, cell.y)
        if (!empty) {
          continue;
        } else break;
      }
      if (!empty) {
        openset.splice(cellIndex, 1)
      }
    } while (!empty);

    if (empty) {
      placeWord(table, cell, word, dir)
      wordlist[sortedWordlist[i].index].start = [cell.x, cell.y]
      wordlist[sortedWordlist[i].index].end = [cell.x + (word.length - 1) * dir.x, cell.y + (word.length - 1) * dir.y]
    }
  }
}

function getDirIndex(cell, h, w) {
  if (cell.x === 0 || cell.x === h) {
    return 0
  } else if (cell.y === 0 || cell.y === w) {
    return 1;
  }
  return randomInt(2, 4)
}

function placeWord(table, cell, word, dir) {
  let x = cell.x;
  let y = cell.y;
  for (const char of word) {
    table[x][y] = char;
    x += dir.x;
    y += dir.y
  }
}

function isEmpty(table, word, dir, x, y) {
  let empty = true, usedSameCharBefore = false;
  if (!dir.check(word.length, x, y)) return false;
  for (const char of word) {
    const sameChar = char.toUpperCase() === ("" + table[x][y]).toUpperCase()
    empty = (table[x][y] === 0 || (!usedSameCharBefore && sameChar))
    usedSameCharBefore = sameChar;
    if (!empty) break;
    x += dir.x;
    y += dir.y
  }
  return empty;
}

function getOpenset(h, w, l) {
  const openset = [];
  const maxX = h - l
  const maxY = w - l
  for (let i = 0; i < h * w; i++) {
    const x = Math.floor(i / w)
    const y = Math.floor(i % h)
    if (x > maxX && y > maxY) continue;
    openset.push({ x, y })
  }
  return openset;
}

function fillEmptyCells(table) {
  table.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (!cell) table[x][y] = String.fromCharCode(randomInt(65, 91))
    })
  })
}


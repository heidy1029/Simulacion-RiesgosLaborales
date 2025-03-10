// Each cell on the crossword grid is null or one of these
function CrosswordCell(letter){
    this.char = letter; // the actual letter for the cell on the crossword
    // If a word hits this cell going in the "across" direction, this will be a CrosswordCellNode
    this.across = null; 
    // If a word hits this cell going in the "down" direction, this will be a CrosswordCellNode
    this.down = null;
}

// You can tell if the Node is the start of a word (which is needed if you want to number the cells)
// and what word and clue it corresponds to (using the index)
function CrosswordCellNode(is_start_of_word, index){
    this.is_start_of_word = is_start_of_word;
    this.index = index; // use to map this node to its word or clue
}

function WordElement(word, index){
    this.word = word; // the actual word
    this.index = index; // use to map this node to its word or clue
}

function Crossword(words_in, clues_in){
    var GRID_ROWS = 50;
    var GRID_COLS = 50;
    // This is an index of the positions of the char in the crossword (so we know where we can potentially place words)
    // example {"a" : [{'row' : 10, 'col' : 5}, {'row' : 62, 'col' :17}], {'row' : 54, 'col' : 12}], "b" : [{'row' : 3, 'col' : 13}]} 
    // where the two item arrays are the row and column of where the letter occurs
    var char_index = {};  

    // these words are the words that can't be placed on the crossword
    var bad_words;

    // returns the crossword grid that has the ratio closest to 1 or null if it can't build one
    this.getSquareGrid = function(max_tries){
        var best_grid = null;
        var best_ratio = 0;
        for(var i = 0; i < max_tries; i++){
            var a_grid = this.getGrid(1);
            if(a_grid == null) continue;
            var ratio = Math.min(a_grid.length, a_grid[0].length) * 1.0 / Math.max(a_grid.length, a_grid[0].length);
            if(ratio > best_ratio){
                best_grid = a_grid;
                best_ratio = ratio;
            }

            if(best_ratio == 1) break;
        }
        return best_grid;
    }

    // returns an abitrary grid, or null if it can't build one
    this.getGrid = function(max_tries){
        for(var tries = 0; tries < max_tries; tries++){
            clear(); // always start with a fresh grid and char_index
            // place the first word in the middle of the grid
            var start_dir = randomDirection();
            var r = Math.floor(grid.length / 2);
            var c = Math.floor(grid[0].length / 2);
            var word_element = word_elements[0];
            if(start_dir == "across"){
                c -= Math.floor(word_element.word.length/2);
            } else {
                r -= Math.floor(word_element.word.length/2);
            }

            if(canPlaceWordAt(word_element.word, r, c, start_dir) !== false){
                placeWordAt(word_element.word, word_element.index, r, c, start_dir);
            } else {
                bad_words = [word_element];
                return null;
            }

            // start with a group containing all the words (except the first)
            // as we go, we try to place each word in the group onto the grid
            // if the word can't go on the grid, we add that word to the next group 
            var groups = [];
            groups.push(word_elements.slice(1));
            for(var g = 0; g < groups.length; g++){
                word_has_been_added_to_grid = false;
                // try to add all the words in this group to the grid
                for(var i = 0; i < groups[g].length; i++){
                    var word_element = groups[g][i]; 
                    var best_position = findPositionForWord(word_element.word);
                    if(!best_position){ 
                        // make the new group (if needed)
                        if(groups.length - 1 == g) groups.push([]);
                        // place the word in the next group
                        groups[g+1].push(word_element);
                    } else {
                        var r = best_position["row"], c = best_position["col"], dir = best_position['direction'];
                        placeWordAt(word_element.word, word_element.index, r, c, dir);
                        word_has_been_added_to_grid = true;           
                    }
                }
                // if we haven't made any progress, there is no point in going on to the next group
                if(!word_has_been_added_to_grid) break;
            }
            // no need to try again
            if(word_has_been_added_to_grid) return minimizeGrid();  
        }

        bad_words = groups[groups.length - 1];
        return null;
    }

    // returns the list of WordElements that can't fit on the crossword
    this.getBadWords = function(){
        return bad_words;
    }

    // get two arrays ("across" and "down") that contain objects describing the
    // topological position of the word (e.g. 1 is the first word starting from
    // the top left, going to the bottom right), the index of the word (in the
    // original input list), the clue, and the word itself
    this.getLegend = function(grid){
        var groups = {"across" : [], "down" : []};
        var position = 1;
        for(var r = 0; r < grid.length; r++){ 
            for(var c = 0; c < grid[r].length; c++){
                var cell = grid[r][c];
                var increment_position = false;
                // check across and down
                for(var k in groups){
                    // does a word start here? (make sure the cell isn't null, first)
                    if(cell && cell[k] && cell[k]['is_start_of_word']){
                        var index = cell[k]['index'];
                        groups[k].push({"position" : position, "index" : index, "clue" : clues_in[index], "word" : words_in[index]});
                        increment_position = true;
                    }
                }

                if(increment_position) position++;
            }
        }
        return groups;
    }


    // move the grid onto the smallest grid that will fit it
    var minimizeGrid = function(){
        // find bounds
        var r_min = GRID_ROWS-1, r_max = 0, c_min = GRID_COLS-1, c_max = 0;
        for(var r = 0; r < GRID_ROWS; r++){
            for(var c = 0; c < GRID_COLS; c++){
                var cell = grid[r][c];
                if(cell != null){
                    if(r < r_min) r_min = r;
                    if(r > r_max) r_max = r;
                    if(c < c_min) c_min = c;
                    if(c > c_max) c_max = c;
                }
            }
        }
        // initialize new grid
        var rows = r_max - r_min + 1; 
        var cols = c_max - c_min + 1; 
        var new_grid = new Array(rows);
        for(var r = 0; r < rows; r++){
            for(var c = 0; c < cols; c++){
                new_grid[r] = new Array(cols);
            }
        }

        // copy the grid onto the smaller grid
        for(var r = r_min, r2 = 0; r2 < rows; r++, r2++){
            for(var c = c_min, c2 = 0; c2 < cols; c++, c2++){
                new_grid[r2][c2] = grid[r][c];
            }
        }

        return new_grid;
    }

    // helper for placeWordAt();
    var addCellToGrid = function(word, index_of_word_in_input_list, index_of_char, r, c, direction){
        var char = word.charAt(index_of_char);
        if(grid[r][c] == null){
            grid[r][c] = new CrosswordCell(char);

            // init the char_index for that character if needed
            if(!char_index[char]) char_index[char] = [];

            // add to index
            char_index[char].push({"row" : r, "col" : c});
        }

        var is_start_of_word = index_of_char == 0;
        grid[r][c][direction] = new CrosswordCellNode(is_start_of_word, index_of_word_in_input_list);

    } 

    // place the word at the row and col indicated (the first char goes there)
    // the next chars go to the right (across) or below (down), depending on the direction
    var placeWordAt = function(word, index_of_word_in_input_list, row, col, direction){
        if(direction == "across"){
            for(var c = col, i = 0; c < col + word.length; c++, i++){
                addCellToGrid(word, index_of_word_in_input_list, i, row, c, direction);
            }
        } else if(direction == "down"){
            for(var r = row, i = 0; r < row + word.length; r++, i++){
                addCellToGrid(word, index_of_word_in_input_list, i, r, col, direction);
            }     
        } else {
            throw "Invalid Direction";  
        }
    }

    // you can only place a char where the space is blank, or when the same
    // character exists there already
    // returns false, if you can't place the char
    // 0 if you can place the char, but there is no intersection
    // 1 if you can place the char, and there is an intersection
    var canPlaceCharAt = function(char, row, col){
        // no intersection
        if(grid[row][col] == null) return 0;
        // intersection!
        if(grid[row][col]['char'] == char) return 1;

        return false;
    }

    // determines if you can place a word at the row, column in the direction
    var canPlaceWordAt = function(word, row, col, direction){
        // out of bounds
        if(row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) return false;

        if(direction == "across"){
            // out of bounds (word too long)
            if(col + word.length > grid[row].length) return false;
            // can't have a word directly to the left
            if(col - 1 >= 0 && grid[row][col - 1] != null) return false;
            // can't have word directly to the right
            if(col + word.length < grid[row].length && grid[row][col+word.length] != null) return false;

            // check the row above to make sure there isn't another word
            // running parallel. It is ok if there is a character above, only if
            // the character below it intersects with the current word
            for(var r = row - 1, c = col, i = 0; r >= 0 && c < col + word.length; c++, i++){
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[row][c] != null && grid[row][c]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if(!can_place_here) return false;
            }

            // same deal as above, we just search in the row below the word
            for(var r = row + 1, c = col, i = 0; r < grid.length && c < col + word.length; c++, i++){
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[row][c] != null && grid[row][c]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if(!can_place_here) return false;
            }

            // check to make sure we aren't overlapping a char (that doesn't match)
            // and get the count of intersections
            var intersections = 0;
            for(var c = col, i = 0; c < col + word.length; c++, i++){
                var result = canPlaceCharAt(word.charAt(i), row, c);
                if(result === false) return false;
                intersections += result;
            }
        } else if(direction == "down"){
            // out of bounds
            if(row + word.length > grid.length) return false;
            // can't have a word directly above
            if(row - 1 >= 0 && grid[row - 1][col] != null) return false;
            // can't have a word directly below
            if(row + word.length < grid.length && grid[row+word.length][col] != null) return false;

            // check the column to the left to make sure there isn't another
            // word running parallel. It is ok if there is a character to the
            // left, only if the character to the right intersects with the
            // current word
            for(var c = col - 1, r = row, i = 0; c >= 0 && r < row + word.length; r++, i++){
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[r][col] != null && grid[r][col]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if(!can_place_here) return false;
            }

            // same deal, but look at the column to the right
            for(var c = col + 1, r = row, i = 0; r < row + word.length && c < grid[r].length; r++, i++){
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[r][col] != null && grid[r][col]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if(!can_place_here) return false;
            }

            // check to make sure we aren't overlapping a char (that doesn't match)
            // and get the count of intersections
            var intersections = 0;
            for(var r = row, i = 0; r < row + word.length; r++, i++){
                var result = canPlaceCharAt(word.charAt(i, 1), r, col);
                if(result === false) return false;
                intersections += result;
            }
        } else {
            throw "Invalid Direction";  
        }
        return intersections;
    }

    var randomDirection = function(){
        return Math.floor(Math.random()*2) ? "across" : "down";
    }

    var findPositionForWord = function(word){
        // check the char_index for every letter, and see if we can put it there in a direction
        var bests = [];
        for(var i = 0; i < word.length; i++){
            var possible_locations_on_grid = char_index[word.charAt(i)];
            if(!possible_locations_on_grid) continue;
            for(var j = 0; j < possible_locations_on_grid.length; j++){
                var point = possible_locations_on_grid[j];
                var r = point['row'];
                var c = point['col'];
                // the c - i, and r - i here compensate for the offset of character in the word
                var intersections_across = canPlaceWordAt(word, r, c - i, "across");
                var intersections_down = canPlaceWordAt(word, r - i, c, "down");

                if(intersections_across !== false)
                    bests.push({"intersections" : intersections_across, "row" : r, "col" : c - i, "direction" : "across"});
                if(intersections_down !== false)
                    bests.push({"intersections" : intersections_down, "row" : r - i, "col" : c, "direction" : "down"});
            }
        }

        if(bests.length == 0) return false;

        // find a good random position
        var best = bests[Math.floor(Math.random()*bests.length)];

        return best;
    }

    var clear = function(){
        for(var r = 0; r < grid.length; r++){
            for(var c = 0; c < grid[r].length; c++){
                grid[r][c] = null;
            }
        }
        char_index = {};
    }

    // constructor
    if(words_in.length < 2) throw "A crossword must have at least 2 words";
    if(words_in.length != clues_in.length) throw "The number of words must equal the number of clues";  

    // build the grid;
    var grid = new Array(GRID_ROWS);
    for(var i = 0; i < GRID_ROWS; i++){
        grid[i] = new Array(GRID_COLS); 
    }

    // build the element list (need to keep track of indexes in the originial input arrays)
    var word_elements = []; 
    for(var i = 0; i < words_in.length; i++){
        word_elements.push(new WordElement(words_in[i], i));
    }

    // I got this sorting idea from http://stackoverflow.com/questions/943113/algorithm-to-generate-a-crossword/1021800#1021800
    // seems to work well
    word_elements.sort(function(a, b){ return b.word.length - a.word.length; });
}

var CrosswordUtils = {
    PATH_TO_PNGS_OF_NUMBERS: "/juegos/numbers/",
    questionPositions: {},
    
    toHtml: function(grid, show_answers) {
        if(grid == null) return;
        var html = [];
        html.push("<table class='crossword'>");
        var label = 1;
        var uanum = 0;
        
        this.questionPositions = {};
        
        // Primer paso: mapear los números de las preguntas
        var wordNumbers = {};
        for(var r = 0; r < grid.length; r++){
            for(var c = 0; c < grid[r].length; c++){
                var cell = grid[r][c];
                if(cell && (cell['across']?.['is_start_of_word'] || cell['down']?.['is_start_of_word'])) {
                    if(cell['across']?.['is_start_of_word']) {
                        wordNumbers[`${r}-${c}-across`] = label;
                    }
                    if(cell['down']?.['is_start_of_word']) {
                        wordNumbers[`${r}-${c}-down`] = label;
                    }
                    label++;
                }
            }
        }
        
        // Resetear label para el segundo recorrido
        label = 1;
        
        // Segundo paso: generar el HTML
        for(var r = 0; r < grid.length; r++){
            html.push("<tr>");
            for(var c = 0; c < grid[r].length; c++){
                var cell = grid[r][c];
                var is_start_of_word = false;
                var questionNumbers = [];
                
                if(cell == null){
                    var char = "&nbsp;";
                    var css_class = "no-border";
                } else {
                    var char = cell['char'];
                    var css_class = "";
                    is_start_of_word = (cell['across']?.['is_start_of_word'] || cell['down']?.['is_start_of_word']);
                    
                    // Buscar el número de pregunta para cada dirección
                    if(cell['across']) {
                        // Encontrar la celda inicial de esta palabra horizontal
                        let startCol = c;
                        while(startCol > 0 && grid[r][startCol-1] && grid[r][startCol-1]['across']) {
                            startCol--;
                        }
                        let acrossNum = wordNumbers[`${r}-${startCol}-across`];
                        if(acrossNum) questionNumbers.push(acrossNum);
                    }
                    
                    if(cell['down']) {
                        // Encontrar la celda inicial de esta palabra vertical
                        let startRow = r;
                        while(startRow > 0 && grid[startRow-1] && grid[startRow-1][c] && grid[startRow-1][c]['down']) {
                            startRow--;
                        }
                        let downNum = wordNumbers[`${startRow}-${c}-down`];
                        if(downNum) questionNumbers.push(downNum);
                    }
                }
                
                // Crear atributos data para los números de pregunta
                var dataAttributes = questionNumbers.length > 0 ? 
                    ' data-question="' + questionNumbers.join(' ') + '"' : '';
                
                if(is_start_of_word) {
                    var currentLabel = label;
                    this.questionPositions[currentLabel] = {
                        row: r,
                        col: c,
                        direction: {
                            across: cell['across']?.['is_start_of_word'],
                            down: cell['down']?.['is_start_of_word']
                        }
                    };
                    
                    var img_url = this.PATH_TO_PNGS_OF_NUMBERS + currentLabel + ".png";
                    html.push("<td class='" + css_class + " relative' " +
                             "title='" + r + ", " + c + "' " +
                             "style=\"background-image:url('" + img_url + "')\" " +
                             "data-position='" + currentLabel + "'" +
                             dataAttributes + ">");
                    label++;      
                } else {
                    html.push("<td class='" + css_class + " relative' " +
                             "title='" + r + ", " + c + "'" +
                             dataAttributes + ">");
                }
                
                if(show_answers) {
                    html.push("<input type='text' width='25' class='" + css_class + " input' " +
                             "oninput='typechar(this)' maxlength='1' onkeyup='forceLower(this)' onclick='typeclick(this)' class='fmonserrat'" +
                             dataAttributes + " /> " +
                             "<span class='canswer none' id='chart" + uanum + "'>" + char + "</span>" +
                             "<span class='uanswer none' id='ua" + uanum + "'></span>");
                    uanum++;
                } else {
                    html.push("&nbsp;");                
                }
            }
            html.push("</tr>");
        }
        html.push("</table>");
        return html.join("\n");
    },

    getQuestionPosition: function(questionNumber) {
        return this.questionPositions[questionNumber];
    },
    
    getQuestionsInRow: function(rowNumber) {
        return Object.entries(this.questionPositions)
            .filter(([_, pos]) => pos.row === rowNumber)
            .map(([number, pos]) => ({
                number: parseInt(number),
                position: pos
            }));
    }
};

function forceLower(e){
    e.value = e.value.toUpperCase()
}
var selectedua = -1;
var wordC = [];
window.wordIncorrect = 0;
function getWordInputs(currentInput) {
    const cell = currentInput.closest('td');
    const questionNumbers = cell.dataset.question.split(' ');
    const direction = getWordDirection(currentInput);
    const wordNumber = questionNumbers.find(num => {
        const pos = CrosswordUtils.getQuestionPosition(parseInt(num));
        return pos && pos.direction[direction];
    });

    if (!wordNumber) return [];

    // Obtener todas las celdas que pertenecen a la palabra actual
    return Array.from(document.querySelectorAll(`td[data-question*="${wordNumber}"]`))
        .map(td => td.querySelector('input'))
        .filter(input => input); // Filtrar cualquier null
}

// Función para determinar la dirección de la palabra actual (across o down)
function getWordDirection(currentInput) {
    const cell = currentInput.closest('td');
    const questionNumbers = cell.dataset.question.split(' ');
    
    // Si solo hay un número de pregunta, usamos ese
    if (questionNumbers.length === 1) {
        const pos = CrosswordUtils.getQuestionPosition(parseInt(questionNumbers[0]));
        return pos.direction.across ? 'across' : 'down';
    }
    
    // Si hay dos números, necesitamos determinar cuál es la dirección activa
    // Podemos usar la última dirección seleccionada o implementar una lógica personalizada
    return currentWordDirection || 'across'; // currentWordDirection debe ser una variable global
}

// Variable global para mantener la dirección actual de la palabra
let currentWordDirection = 'across';

// Función para cambiar la dirección actual
function toggleDirection() {
    currentWordDirection = currentWordDirection === 'across' ? 'down' : 'across';
}

// Variables globales necesarias
window.currentWordDirection = 'across';
window.lastFocusedInput = null;

// Modifica la función typechar existente
function typechar(e) {
    // Mantener el input actual como referencia
    window.lastFocusedInput = e;
    
    if (e.value.length > 0) {
        $("#" + selectedua).html(e.value);
        $("#vkeyboard").hide();
        
        /* Validacion para ver si la letra agregada es correcta o incorreta */
        if(e.parentNode.querySelector(".canswer").textContent === e.value.toUpperCase()){
            e.parentNode.style.backgroundColor = "#0079F2";
            e.style.color = "#fff";
        } else {
            e.parentNode.style.backgroundColor = "#F1273F";
            e.style.color = "#fff";
            window.wordIncorrect = window.wordIncorrect + 1;
            if(window.externalFunction){
                window.externalFunction(window.wordIncorrect);
            }
        }

        // Obtener el siguiente input en la secuencia
        const nextInput = findNextInput(e);
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
        
        /* validacion para ver si las letras escritas son todas correctas */
        let allTds = document.querySelectorAll(".crossword td:not(.no-border)");
        wordC = [];
        
        allTds.forEach(td => {
            if(td.style.backgroundColor === "rgb(0, 121, 242)"){
                wordC.push(td);
                if(wordC.length === allTds.length){
                    // Dispatch un evento personalizado cuando se complete el crucigrama
                    const event = new CustomEvent('crosswordCompleted', {
                        detail: {
                            totalWords: allTds.length,
                            incorrectAttempts: window.wordIncorrect
                        }
                    });
                    document.dispatchEvent(event);
                }
            }
        });
    }
}

// Función para encontrar el siguiente input en la secuencia
function findNextInput(currentInput) {
    const cell = currentInput.closest('td');
    const questionNumbers = cell.dataset.question ? cell.dataset.question.split(' ') : [];
    
    // Si no hay números de pregunta, retornar null
    if (!questionNumbers.length) return null;
    
    // Obtener todas las celdas que comparten el mismo número de pregunta
    const currentNumber = questionNumbers[0]; // Usamos el primer número por defecto
    const relatedCells = Array.from(document.querySelectorAll(`td[data-question*="${currentNumber}"]`));
    
    // Ordenar las celdas según su posición
    const sortedCells = relatedCells.sort((a, b) => {
        const aPos = a.title.split(',').map(Number);
        const bPos = b.title.split(',').map(Number);
        return aPos[0] === bPos[0] ? aPos[1] - bPos[1] : aPos[0] - bPos[0];
    });
    
    // Encontrar el índice de la celda actual
    const currentIndex = sortedCells.indexOf(cell);
    
    // Si hay una siguiente celda, retornar su input
    if (currentIndex < sortedCells.length - 1) {
        return sortedCells[currentIndex + 1].querySelector('input');
    }
    
    return null;
}

// Agregar event listeners para el manejo de teclas
document.addEventListener('keydown', function(e) {
    const activeElement = document.activeElement;
    if (!activeElement || !activeElement.matches('.crossword input')) return;
    const cell = activeElement.closest('td');
    if (!cell) return;
    switch(e.key) {
        case 'Backspace':
            if (!activeElement.value) {
                e.preventDefault();
                const prevInput = findPreviousInput(activeElement);
                if (prevInput) {
                    prevInput.value = '';
                    prevInput.focus();
                    // Disparar evento de input para actualizar la validación
                    const event = new Event('input', { bubbles: true });
                    prevInput.dispatchEvent(event);
                }
            }
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            const nextRight = findAdjacentInput(activeElement, 0, 1);
            if (nextRight) nextRight.focus();
            break;
            
        case 'ArrowLeft':
            e.preventDefault();
            const nextLeft = findAdjacentInput(activeElement, 0, -1);
            if (nextLeft) nextLeft.focus();
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            const nextDown = findAdjacentInput(activeElement, 1, 0);
            if (nextDown) nextDown.focus();
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            const nextUp = findAdjacentInput(activeElement, -1, 0);
            if (nextUp) nextUp.focus();
            break;
    }
});

// Función para encontrar el input anterior en la secuencia
function findPreviousInput(currentInput) {
    const cell = currentInput.closest('td');
    const questionNumbers = cell.dataset.question ? cell.dataset.question.split(' ') : [];
    
    if (!questionNumbers.length) return null;
    
    const currentNumber = questionNumbers[0];
    const relatedCells = Array.from(document.querySelectorAll(`td[data-question*="${currentNumber}"]`));
    
    const sortedCells = relatedCells.sort((a, b) => {
        const aPos = a.title.split(',').map(Number);
        const bPos = b.title.split(',').map(Number);
        return aPos[0] === bPos[0] ? aPos[1] - bPos[1] : aPos[0] - bPos[0];
    });
    
    const currentIndex = sortedCells.indexOf(cell);
    
    if (currentIndex > 0) {
        return sortedCells[currentIndex - 1].querySelector('input');
    }
    
    return null;
}

// Función para encontrar inputs adyacentes (para las teclas de flecha)
function findAdjacentInput(currentInput, rowOffset, colOffset) {
    const currentCell = currentInput.closest('td');
    const [currentRow, currentCol] = currentCell.title.split(',').map(n => parseInt(n.trim()));
    
    // Buscar la celda en la posición adyacente
    const cells = document.querySelectorAll('.crossword td');
    for (let cell of cells) {
        const [row, col] = cell.title.split(',').map(n => parseInt(n.trim()));
        if (row === currentRow + rowOffset && col === currentCol + colOffset) {
            const input = cell.querySelector('input');
            if (input) return input;
        }
    }
    
    return null;
}









function typeclick(e){
    //console.log(e.target.parentNode.dataset.question.charAt(0))
    let arrPreguntas = JSON.parse( localStorage.getItem("question") );
    let position = parseInt(e.parentNode.dataset.question.charAt(0) || target.parentElement.dataset.position);
    arrPreguntas.forEach(pregunta => {
      if(pregunta.p === parseInt(position)){
        document.querySelector("#preguntaDiv").innerText = pregunta.q;
      }
    })
}
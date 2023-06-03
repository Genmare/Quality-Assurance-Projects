class SudokuSolver {

  getChar2num(char) { return char.charCodeAt(0) - 65; }

  splitPuzzleStrByRow(puzzleString) {
    const puzzleArr = Array.from(puzzleString);
    let puzzle2DArr = [];
    for(let r = 0; r < 9; r++ ){
      let row = [];
      for(let c = 0; c < 9; c++){
        row.push(puzzleArr[9*r + c]);
      }
      puzzle2DArr.push(row);
    }
    return puzzle2DArr;
  }
  splitPuzzleStrByCol(puzzleString) {
    const puzzleArr = Array.from(puzzleString);
    let puzzle2DArr = [];
    for(let c = 0; c < 9; c++){
      let col = [];
      for(let r = 0; r < 9; r++ ){
        col.push(puzzleArr[9*r + c]);
      }
      puzzle2DArr.push(col);
    }
    return puzzle2DArr;
  }

  splitPuzzleStrBySquare(puzzleString) {
    const puzzleArr = Array.from(puzzleString);
    let puzzle2DArr = [];
    for(let f = 0; f < 3; f++ ){
      for(let r = 0; r < 3; r++ ){
        let square = [];
        for(let d = 0; d < 3; d++)
          for(let c = 0; c < 3; c++){
            square.push(puzzleArr[27*f + 3*r + 9*d + c ]);
        }
        puzzle2DArr.push(square);
      }
    }
    return puzzle2DArr;
  }

  /**
   * Check if the user input is valid
   * @param {string} puzzleString 
   * @returns {boolean}
   */
  validate(puzzleString) {
    const result = { error: null };

    const isNumberOrDot = /^[.\d]*$/.test(puzzleString);
    if(!isNumberOrDot)
      result.error = 'Invalid characters in puzzle';

    if(puzzleString.length !== 81)
      result.error = 'Expected puzzle to be 81 characters long';
    
    return result;
  }

  checkCoordinate(row, column) {
    console.log(`checkCoordinate row=${row} column=${column}`);
    const col = +column;
    console.log(`checkCoordinate /[A-I]/.test(${row})`, 
      /[A-I]/.test(row), 'col =', col);
    return /[A-I]/.test(row) && 0 < col && col < 10;
  }

  checkValue(value) {
    const val = +value;
    return 0 < val && val < 10;
  }

  /**
   * Test the value validity by row
   * @param {string[][]} splitPuzzleStr double array of the puzzle by row
   * @param {number} row 
   * @param {number} column 
   * @param {string} value 
   * @returns {boolean} 
   */
  checkRowPlacementByPuzzleArray(splitPuzzleStr, row, column, value){
    splitPuzzleStr[row][column] = '.';

    return !splitPuzzleStr[row].includes(value);
  }

  /**
   * Test the value validity by row
   * @param {string} puzzleString the puzzle
   * @param {number} row 
   * @param {number} column 
   * @param {string} value 
   * @returns {boolean} 
   */
  checkRowPlacement(puzzleString, row, column, value) {
    const splitPuzzleStr = this.splitPuzzleStrByRow(puzzleString);

    return this.checkRowPlacementByPuzzleArray(splitPuzzleStr, row, column, value);
  }

  /**
   * Test the value validity by column
   * @param {string[][]} splitPuzzleStr double array of the puzzle by row
   * @param {number} row 
   * @param {number} column 
   * @param {string} value 
   * @returns {boolean} 
   */
  checkColPlacementByPuzzleArray(splitPuzzleStr, row, column, value){
    splitPuzzleStr[column][row] = '.';
    return !splitPuzzleStr[column].includes(value);
  }

  /**
   * Test the value validity by column
   * @param {string} puzzleString the puzzle
   * @param {number} row 
   * @param {number} column 
   * @param {string} value 
   * @returns {boolean} 
   */
  checkColPlacement(puzzleString, row, column, value) {
    const splitPuzzleStr = this.splitPuzzleStrByCol(puzzleString);
    return this.checkColPlacementByPuzzleArray(splitPuzzleStr, row, column, value);
  }

  /**
   * Test the value validity by region
   * @param {string[][]} splitPuzzleBySquareStr double array of the puzzle by region
   * @param {number} row 
   * @param {number} column 
   * @param {string} value 
   * @returns {boolean} 
   */
  checkRegionPlacementByPuzzleArray(splitPuzzleBySquareStr, row, column, value){
    const regIndex = Math.floor(row/3)*3 + Math.floor(column/3);
    const squareIndex = (row%3)*3 + column%3;

    splitPuzzleBySquareStr[regIndex][squareIndex] = '.';
    return !splitPuzzleBySquareStr[regIndex].includes(value);
  }

  /**
   * Test the value validity by region
   * @param {string} puzzleString the puzzle
   * @param {number} row 
   * @param {number} column 
   * @param {string} value 
   * @returns {boolean} 
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    const splitPuzzleBySquareStr = this.splitPuzzleStrBySquare(puzzleString);
    return this.checkRegionPlacementByPuzzleArray(splitPuzzleBySquareStr, row, column, value); 
  }

  deepCopy(arr){
    let copy = [];
    arr.forEach(elem => {
      if(Array.isArray(elem)){
        copy.push(this.deepCopy(elem))
      }else{
          copy.push(elem)
      }
    })
    return copy;
  }


  fillFigureArray() {
    const result = Array(9).fill().map(() => Array(9).fill(
      Array.from({ length: 9}, (_, index) => (index+1).toString()
    )));
    return result;
  }


  /**
   * Find unique values, fill the array with it 
   * if unique values are invalid, return null
   * @param {string[][]} splitPuzzleRowStr 
   * @param {string[][][]} boxes 
   * @returns {boolean|null} splitPuzzleRowStr modify or not
   */
  findAndSetUniqueValue(splitPuzzleRowStr, splitPuzzleColStr, splitPuzzleRegStr, boxes) {
    let uniqueValue = false;
    let regIndex, squareIndex;

    for(let r = 0; r < 9; r++)
      for(let c = 0; c < 9; c++)
        for(let f = 0; f < 9; f++)
          if(boxes[r][c].length == 1){
            if(this.checkRowPlacementByPuzzleArray(splitPuzzleRowStr, r, c, boxes[r][c][0]) &&
            this.checkColPlacementByPuzzleArray(splitPuzzleColStr, r, c, boxes[r][c][0]) &&
            this.checkRegionPlacementByPuzzleArray(splitPuzzleRegStr, r, c, boxes[r][c][0]) ){
              splitPuzzleRowStr[r][c] = boxes[r][c][0];
              splitPuzzleColStr[c][r] = boxes[r][c][0];
              regIndex = Math.floor(r/3)*3 + Math.floor(c/3);
              squareIndex = (r%3)*3 + c%3;
              splitPuzzleRegStr[regIndex][squareIndex] = boxes[r][c][0];
              uniqueValue = true;
            } else {
              // if a same unique value is invalid
              return null;
            }
          }
    return uniqueValue;
  }

  /**
   * Update puzzle by column and region according to row
   * @param {string[][]} puzzleByRow array of puzzle row
   * @param {string[][]} puzzleByCol array of puzzle col
   * @param {string[][]} puzzleByReg array of puzzel region
   */
  updateArray(puzzleByRow, puzzleByCol, puzzleByReg){
    let regIndex, squareIndex;

    for(let r = 0; r < 9; r++){
      for(let c = 0; c < 9; c++){
        regIndex = Math.floor(r/3)*3 + Math.floor(c/3);
        squareIndex = (r%3)*3 + c%3;
        puzzleByReg[regIndex][squareIndex] = puzzleByRow[r][c];
      }
    }
        
    for(let r = 0; r < 9; r++){
      for(let c = 0; c < 9; c++){
        puzzleByCol[c][r] = puzzleByRow[r][c];
      }
    }
  }

  /**
   *  Update splitPuzzleRowStr with possible values
   * @param {string[][][]} boxes triple array of possible cell values
   * @param {string[][]} splitPuzzleRowStr 
   * @param {string[][]} splitPuzzleColStr 
   * @param {string[][]} splitPuzzleRegStr 
   * @returns splitPuzzleRowStr with possible cell values added,
   * null if sudoku invalid
   */
  fillPossibleCellValues(
    boxes,
    splitPuzzleRowStr,
    splitPuzzleColStr,
    splitPuzzleRegStr
  ) {

    let uniqueValue = true;

    while(uniqueValue) {
    for(let r = 0; r < 9; r++){
      for(let c = 0; c < 9; c++){
        boxes[r][c] = [];
        if(splitPuzzleRowStr[r][c] == '.'){
          for(let f = 0; f < 9; f++){
            if(this.checkRowPlacementByPuzzleArray(splitPuzzleRowStr, r, c, (f+1).toString()) &&
              this.checkColPlacementByPuzzleArray(splitPuzzleColStr, r, c, (f+1).toString()) &&
              this.checkRegionPlacementByPuzzleArray(splitPuzzleRegStr, r, c, (f+1).toString()) ){
              boxes[r][c].push((f+1).toString());
            }
          }
        }
      }
    }
    uniqueValue = this.findAndSetUniqueValue(splitPuzzleRowStr, splitPuzzleColStr, splitPuzzleRegStr, boxes);
    if(uniqueValue === null)
      return null;
    if(uniqueValue)
      this.updateArray(splitPuzzleRowStr, splitPuzzleColStr, splitPuzzleRegStr);
    }

    return splitPuzzleRowStr
  }


  fillSudoku(puzzle) {
    let boxes = Array(9).fill().map(() => Array(9).fill());
    let splitPuzzleRowStr = this.splitPuzzleStrByRow(puzzle);
    let splitPuzzleColStr = this.splitPuzzleStrByCol(puzzle);
    let splitPuzzleRegStr = this.splitPuzzleStrBySquare(puzzle);

    let minRow, minCol;
    let splitPuzzleRowStrClone;

    let puzzleRowStrArray = null;

    splitPuzzleRowStr = this.fillPossibleCellValues(
      boxes,
      splitPuzzleRowStr,
      splitPuzzleColStr,
      splitPuzzleRegStr
    );

    if(splitPuzzleRowStr === null)
      return null;

    if(!this.isSudokuArrayComplete(splitPuzzleRowStr)){
      [minRow, minCol] = this.findSmallestRow(boxes);
      
      puzzleRowStrArray = boxes[minRow][minCol].map(
        cellValue => {
          // clone row array
          splitPuzzleRowStrClone = this.deepCopy(splitPuzzleRowStr);
          // update cell value
          splitPuzzleRowStrClone[minRow][minCol] = cellValue;          
          // find possible solution with the cell value in the matrix
          return this.fillSudoku(
            this.puzzleArray2Str(splitPuzzleRowStrClone)
          );
        }
      );
    } else {
      return splitPuzzleRowStr;
    }
    
    let result = puzzleRowStrArray.filter(
      puzzle => puzzle != null && this.isSudokuArrayComplete(puzzle)
    )[0];

    return result;
  }

  /**
   * Convert a double array of the sudoku into a string of the sudoku
   * @param {string[][]} puzzleArray 
   * @returns puzzle representation in string
   */
  puzzleArray2Str(puzzleArray){
    let puzzleStr = '';
    puzzleArray.forEach(row => {
      puzzleStr += row.join('');
    });
    return puzzleStr;
  }

  /**
   * if there isn't a unique solution, retrieve the smallest row for a cell
   * @param {string[][][]} boxes cells solutions
   * @returns coordinate of the smallest Row
   */
  findSmallestRow(boxes){
    let rowIndex = 0;
    let colIndex = 0;
    let minSize = 9;
    let findNoneNull = false;

    // first loop to find none null array
    for(let r = 0; r < 9 && !findNoneNull; r++)
      for(let c = 0; c < 9 && !findNoneNull; c++){
        if(boxes[r][c].length > 0){
          rowIndex = r;
          colIndex = c;
          findNoneNull = true;;
        }
      }

    for(let r = rowIndex; r < 9; r++)
      for(let c = colIndex; c < 9; c++)
        if(boxes[r][c].length < minSize && boxes[r][c].length > 0 ){
          rowIndex = r;
          colIndex = c;
          minSize = boxes[r][c].length;
        }
    return [rowIndex, colIndex];
  }

  /**
   * is complete or not
   * @param {string[][]} puzzleArray 
   * @returns 
   */
  isSudokuArrayComplete(puzzleArray){
    for(let r = 0; r < 9; r++)
      for(let c = 0; c < 9; c++)
        if(puzzleArray[r][c] === '.')
          return false;
    return true;
  }


  solve(puzzleString) {
    let figureBoxes = this.fillFigureArray();

    const puzzleArray = this.fillSudoku(puzzleString, figureBoxes);

    if(puzzleArray == null)
      return { error: 'Puzzle cannot be solved'};

    console.log('this.puzzleArray2Str(puzzleArray) :', this.puzzleArray2Str(puzzleArray));

    return { solution: this.puzzleArray2Str(puzzleArray) };
  }
}

module.exports = SudokuSolver;


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
      // console.log('splitPuzzleStr row:', row);
    }
    // console.log('puzzle2DArr', puzzle2DArr);
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
      // console.log('splitPuzzleStr col:', col);
    }
    // console.log('By Col puzzle2DArr', puzzle2DArr);
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
        // console.log('splitPuzzleStr square:', square);
    }
    }
    // console.log('By Square puzzle2DArr', puzzle2DArr);
    return puzzle2DArr;
  }

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

  checkRowPlacementByPuzzleArray(splitPuzzleStr, row, column, value){
    splitPuzzleStr[row][column] = '.';
    // console.log(`splitPuzzleStr[${row}]=`, splitPuzzleStr[row])
    // delete splitPuzzleStr[row][column];
    return !splitPuzzleStr[row].includes(value);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const splitPuzzleStr = this.splitPuzzleStrByRow(puzzleString);
    // splitPuzzleStr[row][column] = '.';
    // return !splitPuzzleStr[row].includes(value);
    return this.checkRowPlacementByPuzzleArray(splitPuzzleStr, row, column, value);
  }

  checkColPlacementByPuzzleArray(splitPuzzleStr, row, column, value){
    splitPuzzleStr[column][row] = '.';
    // delete splitPuzzleStr[column][row];
    return !splitPuzzleStr[column].includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const splitPuzzleStr = this.splitPuzzleStrByCol(puzzleString);
    return this.checkColPlacementByPuzzleArray(splitPuzzleStr, row, column, value);
  }

  checkRegionPlacementByPussleArray(splitPuzzleBySquareStr, row, column, value){
    const regIndex = Math.floor(row/3)*3 + Math.floor(column/3);
    // console.log(`[(Math.floor(${row}/3)*3 + Math.floor(${column}/3)]=`, regIndex);
    const squareIndex = (row%3)*3 + column%3;
    // console.log('regColIndex=', squareIndex);

    splitPuzzleBySquareStr[regIndex][squareIndex] = '.';
    // delete splitPuzzleBySquareStr[regRowIndex][regColIndex];
    return !splitPuzzleBySquareStr[regIndex].includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const splitPuzzleBySquareStr = this.splitPuzzleStrBySquare(puzzleString);
    return this.checkRegionPlacementByPussleArray(splitPuzzleBySquareStr, row, column, value); 
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


  fillFigureArray(figureArr) {
    // const result = Array(9).fill().map(() => Array(9).fill(JSON.parse(JSON.stringify([...figureArr]))));
    // const result = Array(9).fill().map(() => Array(9).fill(this.deepCopy(figureArr) ));
    // const result = Array(9).fill().map(() => Array(9).fill([...figureArr] ));
    const result = Array(9).fill().map(() => Array(9).fill(
      Array.from({ length: 9}, (_, index) => (index+1).toString()
    )));

    // console.log('fillFigureArray :', result)
    return result;
  }

  // fillFirstFigureArrayByRow(puzzle, figureBoxes) {
  //   const splitPuzzleStr = this.splitPuzzleStrByRow(puzzle);

  //   // for(let r = 0; r < 9; r++){
  //   //   for(let c = 0; c < 9; c++){
  //   //     if(splitPuzzleStr[r][c] !== '.'){
  //   //       console.log(`splitPuzzleStr[${r}][${c}]=`, splitPuzzleStr[r][c]);
  //   //       figureBoxes[r][c] = [];
  //   //     }else{
  //   //       for(let f = 0; f < 9; f++){
  //   //         console.log(`figureBoxes[${r}][${c}][${f}]=`, figureBoxes[r][c][f]);
  //   //         if(!this.checkRowPlacement(puzzle, r, c, (f+1).toString()) ) {
  //   //           figureBoxes[r][c][f] ='x';
  //   //           // delete figureBoxes[r][c][f];
  //   //           }
  //   //         console.log(`figureBoxes[${r}][${c}][${f}]=`, figureBoxes[r][c][f]);
  //   //       }
  //   //       // figureBoxes[r][c] = figureBoxes[r][c].filter(elem => elem === undefined);
  //   //     }
  //   //   }
  //   // }
  //   // const SquareRow = Array(9).fill().map(() => 
  //   //   Array.from({ length: 9}, (_, index) => (index+1).toString()
  //   // ));
  //   for(let r = 0; r < 9; r++){
  //     let SquareRow;
  //     let dotC = 0;
  //     while(splitPuzzleStr[r][dotC] !== '.' && dotC++ < 9);
  //     SquareRow = figureBoxes[r][dotC];

  //     for(let f = 0; f < 9; f++){
  //       if(!this.checkRowPlacement(puzzle, r, dotC, (f+1).toString()) ) {
  //         // figureBoxes[r][c][f] ='x';
  //         SquareRow[f] ='x';
  //       }
  //       // console.log(`figureBoxes[${r}][${c}][${f}]=`, figureBoxes[r][c][f]);
  //     }
  //     for(let c = 0; c < 9; c++){
  //       figureBoxes[r][c] = SquareRow
  //       if(splitPuzzleStr[r][c] !== '.'){
  //         // console.log(`splitPuzzleStr[${r}][${c}]=`, splitPuzzleStr[r][c]);
  //         figureBoxes[r][c] = [];
  //       }
  //     }
  //   }
  //   // console.log('figureBoxes :', figureBoxes);
  //   return figureBoxes;
  // }

  // fillFirstFigureArray(puzzle, figureBoxes) {
  //   const splitPuzzleStrCol = this.splitPuzzleStrByCol(puzzle);

  //   // for(let c = 0; c < 9; c++){
  //   //     for(let r = 0; r < 9; r++){
  //   //     if(splitPuzzleStr[r][c] !== '.'){
  //   //       console.log(`splitPuzzleStr[${r}][${c}]=`, splitPuzzleStr[r][c]);
  //   //       figureBoxes[r][c] = [];
  //   //       // figureBoxes[r][c].fill('.');
  //   //     }else{
  //   //       for(let f = 0; f < 9; f++){
  //   //         console.log(`figureBoxes[${r}][${c}][${f}]=`, figureBoxes[r][c][f]);
  //   //         if(!this.checkColPlacement(puzzle, c, r, (f+1).toString()) ) {
            
  //   //           figureBoxes[r][c][f] ='x';
  //   //           // delete figureBoxes[r][c][f];
  //   //           }
  //   //         console.log(`figureBoxes[${r}][${c}][${f}]=`, figureBoxes[r][c][f]);
  //   //       }
  //   //       // figureBoxes[r][c] = figureBoxes[r][c].filter(elem => elem === undefined);
  //   //     }
  //   //   }
  //   // }

  //   for(let c = 0; c < 9; c++){
  //     let SquareCol;
  //     let dotR = 0;
  //     // while(splitPuzzleStrCol[dotR][c] !== '.' && dotR++ < 9);
  //     while(splitPuzzleStrCol[c][dotR] !== '.' && dotR++ < 9);
  //     // SquareCol = figureBoxes[c][dotR];
  //     SquareCol = figureBoxes[dotR][c];

  //     for(let f = 0; f < 9; f++){
  //       // if(!this.checkColPlacement(puzzle, c, dotR, (f+1).toString()) ) {
  //       if(!this.checkColPlacement(puzzle, dotR, c, (f+1).toString()) ) {
  //         SquareCol[f] ='x';
  //       }
  //     }
  //     for(let r = 0; r < 9; r++){
  //       // figureBoxes[c][r] = SquareCol
  //       figureBoxes[r][c] = SquareCol
  //       if(splitPuzzleStrCol[c][r] !== '.'){
  //         // figureBoxes[c][r] = [];
  //         figureBoxes[r][c] = [];
  //       }
  //     }
  //   }
  //   // console.log('figureBoxes :', figureBoxes);
  //   return figureBoxes;
  // }

  // fillFirstFigureArrayRow(puzzle, figureBoxes){
  //   const splitPuzzleStr = this.splitPuzzleStrByRow(puzzle);

  //   for(let r = 0; r < 9; r++){
  //     for(let c = 0; c < 9; c++){
  //       if(splitPuzzleStr[r][c] !== '.'){
  //         figureBoxes[r][c] = [];
  //       } else {
  //         for(let f = 0; f < 9; f++){
  //           if(!this.checkRowPlacement(puzzle, r, c, (f+1).toString()) ) {
  //             figureBoxes[r][c][f] ='x';
  //           }
  //         }
  //       }
  //     }
  //   }
  //   // console.log('Row figureBoxes :', figureBoxes);
  //   return figureBoxes;
  // }

  // /**
  //  * Transpose a matrix
  //  * @param {string[][]} matrix 
  //  * @returns the transposed matrix
  //  */
  // transpose(matrix) {
  //   // let transposed = [[],[],[]];
  //   let transposed = Array(9).fill().map(() => Array(9).fill());
  //   // console.log('matrix.length',matrix.length);
  //   // console.log('matrix[0].length', matrix[0].length)
  //   for( let i = 0; i < matrix.length; i++) {
  //     for( let j = 0; j < matrix[i].length; j++) {
  //       let new_val = matrix[j][i]
  //       // console.log(`i=${i} j=${j} new_val =`, new_val);
  //       transposed[i][j] = new_val;/*from  w  ww .j  a  va  2s. c o  m*/
  //     };
  //   };
  
  //   return transposed;
  // };

  // fillFirstFigureArrayCol(puzzle, figureBoxes){
  //   // const splitPuzzleStr = this.splitPuzzleStrByRow(puzzle);
  //   const splitPuzzleStr = this.splitPuzzleStrByRow(puzzle);
  //   // console.log('Col Avant figureBoxes :', figureBoxes);

  //   for(let r = 0; r < 9; r++){
  //     for(let c = 0; c < 9; c++){
  //       if(splitPuzzleStr[r][c] !== '.'){
  //         figureBoxes[c][r] = [];
  //         // figureBoxes[r][c] = [];
  //       } else {
  //         // console.log(`figureBoxes[${c}][${r}]=`, figureBoxes[c][r])
  //         for(let f = 0; f < 9 && figureBoxes[c][r] !== []; f++){
  //         // for(let f = 0; f < 9 && figureBoxes[r][c] !== []; f++){
  //         // for(let f = 0; f < 9; f++){
  //           if(figureBoxes[c][r][f] !=='x' && 
  //             !this.checkColPlacement(puzzle, r, c, (f+1).toString()) ) {
  //             figureBoxes[c][r][f] ='x';
  //             // figureBoxes[r][c][f] ='x';
  //           }
  //         }
  //       }
  //     }
  //   }
  //   // console.log('Col figureBoxes :', figureBoxes);
  //   figureBoxes = this.transpose(figureBoxes);
  //   // console.log('Col figureBoxes :', figureBoxes);
  //   return figureBoxes;
  // }

  // reg2Row(matrix) {
  //   let newMatrix = Array(9).fill().map(() => Array(9).fill());

  //   // regIndex = Math.floor(r/3)*3 + Math.floor(c/3);
  //   // squareIndex = (r%3)*3 + c%3;

  //   // [               [                                   ] [
  //   //   regIndex,   =  Math.floor(1/3)*3   Math.floor(1/3)    r
  //   //   squareIndex =  (1%3)*3             1%3                c
  //   // ]               [                                   ]     ]
  //   // [               [                                   ] [
  //   //   r,   =         1%3           -Math.floor(1/3)        regIndex
  //   //   c    =         -(1%3)*3       Math.floor(1/3)*3      squareIndex
  //   // ]               [                                   ]     ]
  //   // (1/( (Math.floor(1/3)*3)*(1%3) - (Math.floor(1/3)) * (1%3)*3 ) ) *

  //   // r = regIndex%3 - Math.floor(squareIndex/3);
  //   // c = -(regIndex%3)*3 + Math.floor(squareIndex/3)*3;

  //   // r = regIndex%3 - Math.floor(squareIndex/3);
  //   // c = -(regIndex%3)*3 + squareIndex;

  //   // r = Math.floor(regIndex/3)*3 + Math.floor(squareIndex/3)
  //   // c = ((squareIndex%3 ) + (regIndex*3)) % 9

  //   // [ [rg0s0, rg0s1, rg0s2, rg1s0, rg1s1, rg1s2, rg2s0, rg2s1, rg2s2],
  //   //   [rg0s3, rg0s4, rg0s5, rg1s3, rg1s4, rg1s5, rg2s3, rg2s4, rg2s5],
  //   //   [rg0s6, rg0s7, rg0s8, rg1s6, rg1s7, rg1s8, rg2s6, rg2s7, rg2s8],
  //   //   [rg3s0, rg3s1, rg3s2, rg4s0, rg4s1, rg4s2, rg5s0, rg5s1, rg5s2],
  //   //   [rg3s3, rg3s4, rg3s5, rg4s3, rg4s4, rg4s5, rg5s3, rg5s4, rg5s5],
  //   //   [rg3s6, rg3s7, rg3s8, rg4s6, rg4s7, rg4s8, rg5s6, rg5s7, rg5s8],
  //   //   [rg6s0, rg6s1, rg6s2, rg7s0, rg7s1, rg7s2, rg8s0, rg8s1, rg8s2],
  //   //   [rg6s3, rg6s4, rg6s5, rg7s3, rg7s4, rg7s5, rg8s3, rg8s4, rg8s5],
  //   //   [rg6s6, rg6s7, rg6s8, rg7s6, rg7s7, rg7s8, rg8s6, rg8s7, rg8s8],
  //   //                                                                   ] 

  //   let r,c;
  //   for( let regIndex = 0; regIndex < matrix.length; regIndex++) {
  //     for( let squareIndex = 0; squareIndex < matrix[regIndex].length; squareIndex++) {

  //       r = Math.floor(regIndex/3)*3 + Math.floor(squareIndex/3)
  //       c = ((squareIndex%3 ) + (regIndex*3)) % 9;

  //       let new_val = matrix[r][c]
  //       // console.log(`i=${regIndex} j=${squareIndex} new_val =`, new_val);
  //       newMatrix[regIndex][squareIndex] = new_val;
  //     };
  //   };
  
  //   return newMatrix;
  // };

  // fillFirstFigureArrayReg(puzzle, figureBoxes){
  //   const splitPuzzleStr = this.splitPuzzleStrByRow(puzzle);
  //   let regIndex, squareIndex;

  //   for(let r = 0; r < 9; r++){
  //     for(let c = 0; c < 9; c++){
  //       regIndex = Math.floor(r/3)*3 + Math.floor(c/3);
  //       squareIndex = (r%3)*3 + c%3;
        
  //       if(splitPuzzleStr[r][c] !== '.'){
  //         // figureBoxes[r][c] = [];
  //         figureBoxes[regIndex][squareIndex] = [];
  //       } else {
  //         for(let f = 0; f < 9; f++){
  //           if(figureBoxes[regIndex][squareIndex][f] ==='x')
  //             continue;
  //           if(!this.checkRegionPlacement(puzzle, r, c, (f+1).toString()) ) {
  //             // figureBoxes[r][c][f] ='x';
  //             figureBoxes[regIndex][squareIndex][f] ='x';
  //           }
  //         }
  //       }
  //     }
  //   }
  //   figureBoxes = this.reg2Row(figureBoxes);
  //   // console.log('figureBoxes :', figureBoxes);
  //   return figureBoxes;
  // }

  // fillFirstFigureArr(puzzleBackup, figureBoxes){
  //   figureBoxes = this.fillFirstFigureArrayRow(puzzleBackup, figureBoxes);
  //   figureBoxes = this.fillFirstFigureArrayCol(puzzleBackup, figureBoxes);
  //   // figureBoxes = this.fillFirstFigureArrayReg(puzzleBackup, figureBoxes);
  //   // console.log('figureBoxes',figureBoxes);
  //   return figureBoxes;
  // }

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
            this.checkRegionPlacementByPussleArray(splitPuzzleRegStr, r, c, boxes[r][c][0]) ){
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



  fillPossibleCell(puzzle) {
    let boxes = Array(9).fill().map(() => Array(9).fill());
    let splitPuzzleRowStr = this.splitPuzzleStrByRow(puzzle);
    let splitPuzzleColStr = this.splitPuzzleStrByCol(puzzle);
    let splitPuzzleRegStr = this.splitPuzzleStrBySquare(puzzle);

    let minRow, minCol;
    let splitPuzzleRowStrClone;

    let puzzleRowStrArray = null;

    // if(!this.isValid(splitPuzzleRowStr))
    //   return null;

    splitPuzzleRowStr = this.recursiveFillPossibleCell(
      boxes,
      splitPuzzleRowStr,
      splitPuzzleColStr,
      splitPuzzleRegStr
    );

    if(splitPuzzleRowStr === null)
      return null;

    // console.log('isSudokuArrayComplete(splitPuzzleRowStr)', this.isSudokuArrayComplete(splitPuzzleRowStr))


    if(!this.isSudokuArrayComplete(splitPuzzleRowStr)){
      [minRow, minCol] = this.findSmallestRow(boxes);
      // console.log(`boxes[${minRow}][${minCol}]=${boxes[minRow][minCol]}`)
      puzzleRowStrArray = boxes[minRow][minCol].map(
        cellValue => {
          // console.log('cellValue :', cellValue);
          // clone row array
          splitPuzzleRowStrClone = this.deepCopy(splitPuzzleRowStr);
          // update cell value
          splitPuzzleRowStrClone[minRow][minCol] = cellValue;          
          // find possible solution with the cell value in the matrix
          return this.fillPossibleCell(
            this.puzzleArray2Str(splitPuzzleRowStrClone)
          );
        }
      );
    } else {
      return splitPuzzleRowStr;
    }
    // puzzleRowStrArray?.forEach( puzzleArray => {
    //   console.log('fillPossibleCell : puzzleArray2Str(puzzleArray) :', this.puzzleArray2Str(puzzleArray))
    // })
    
    let result = puzzleRowStrArray.filter(
      puzzle => puzzle != null && this.isSudokuArrayComplete(puzzle)
    )[0];
    // console.log('puzzleRowStrArray :', puzzleRowStrArray)
    // console.log('splitPuzzleRowStr :', splitPuzzleRowStr)
    // console.log('result :', result);
    return result;
  }

  recursiveFillPossibleCell(
        boxes,
        splitPuzzleRowStr,
        splitPuzzleColStr,
        splitPuzzleRegStr
    ) {
    // let splitPuzzleRowStr = this.splitPuzzleStrByRow(puzzle);
    // let splitPuzzleColStr = this.splitPuzzleStrByCol(puzzle);
    // let splitPuzzleRegStr = this.splitPuzzleStrBySquare(puzzle);
    
    // let boxes = Array(9).fill().map(() => Array(9).fill());
    // console.log('boxes after:', boxes);
    // console.log('splitPuzzleRowStr before:', splitPuzzleRowStr)

    let uniqueValue = true;
    let i = 0;
    // let minRow, minCol;
    // while(i < 10 && uniqueValue) {
      while(uniqueValue) {
        i++;
        for(let r = 0; r < 9; r++){
          for(let c = 0; c < 9; c++){
            boxes[r][c] = [];
            if(splitPuzzleRowStr[r][c] == '.'){
              for(let f = 0; f < 9; f++){
                if(this.checkRowPlacementByPuzzleArray(splitPuzzleRowStr, r, c, (f+1).toString()) &&
                  this.checkColPlacementByPuzzleArray(splitPuzzleColStr, r, c, (f+1).toString()) &&
                  this.checkRegionPlacementByPussleArray(splitPuzzleRegStr, r, c, (f+1).toString()) ){
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
      // [minRow, minCol] = this.findSmallestRow(boxes);

    // }
    // console.log('boxes after :', boxes);
    // console.log('splitPuzzleRowStr after:', splitPuzzleRowStr);
    // console.log( i,' loops');

    return splitPuzzleRowStr
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

    // console.log('findSmallestRow boxes :', boxes)

    // first loop to find none null array
    for(let r = 0; r < 9 && !findNoneNull; r++)
      for(let c = 0; c < 9 && !findNoneNull; c++){
        // console.log(`boxes[${r}][${c}]=`, boxes[r][c])
        // console.log(`boxes[${r}][${c}].length=`, boxes[r][c].length)
        if(boxes[r][c].length > 0){
          rowIndex = r;
          colIndex = c;
          findNoneNull = true;;
        }
      }
    // console.log(`Init rowIndex=${rowIndex}, colIndex=${colIndex}`);

    for(let r = rowIndex; r < 9; r++)
      for(let c = colIndex; c < 9; c++)
        if(boxes[r][c].length < minSize && boxes[r][c].length > 0 ){
          rowIndex = r;
          colIndex = c;
          minSize = boxes[r][c].length
          // console.log(`minSize=${minSize}, rowIndex=${rowIndex}, colIndex=${colIndex}`);
        }
    // console.log(`rowIndex=${rowIndex}, colIndex=${colIndex}`);
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

  // /**
  //  * is complete or not
  //  * @param {string} puzzleStr 
  //  * @returns 
  //  */
  // isSudokuStrComplete(puzzleStr){
  //   return !puzzleStr.includes('.');
  // }

  // isValid(puzzleRowArray){
  //   let puzzleColArray = this.deepCopy(puzzleRowArray);
  //   let puzzleRegArray = this.deepCopy(puzzleRowArray);

  //   this.updateArray(puzzleRowArray, puzzleColArray, puzzleRegArray);

  //   for(let r = 0; r < 9; r++){
  //     for(let c = 0; c < 9; c++){
  //       for(let f = 0; f < 9; f++){
  //         if( !(this.checkRowPlacementByPuzzleArray(puzzleRowArray, r, c, (f+1).toString()) &&
  //           this.checkColPlacementByPuzzleArray(puzzleColArray, r, c, (f+1).toString()) &&
  //           this.checkRegionPlacementByPussleArray(puzzleRegArray, r, c, (f+1).toString())) ){
  //           return false;
  //         }
  //       }
  //     }
  //   }
  //   return true;
  // }

  solve(puzzleString) {
    let figureArr = Array.from({ length: 9}, (value, index) => (index+1).toString() );
    // console.log('figureArr :', figureArr);
    const puzzleBackup = puzzleString;
    // const splitPuzzleStr = this.splitPuzzleStrByRow(puzzleString);

    let figureBoxes = this.fillFigureArray(figureArr);
    // this.fillFirstFigureArrayRow(puzzleBackup, figureBoxes);
    // this.fillFirstFigureArrayCol(puzzleBackup, figureBoxes);
    // this.fillFirstFigureArrayReg(puzzleBackup, figureBoxes);
    // this.fillFirstFigureArr(puzzleBackup, figureBoxes);

    const puzzleArray = this.fillPossibleCell(puzzleBackup, figureBoxes);
    // console.log('solve puzzleArray :', puzzleArray);
    if(puzzleArray == null)
      return { error: 'Puzzle cannot be solved'};
    console.log('this.puzzleArray2Str(puzzleArray) :', this.puzzleArray2Str(puzzleArray))
    return { solution: this.puzzleArray2Str(puzzleArray) };
  }
}

module.exports = SudokuSolver;


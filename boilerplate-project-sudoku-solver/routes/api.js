'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if(!puzzle || !coordinate || !value)
        return res.json({ error: 'Required field(s) missing' });


      const validate = solver.validate(puzzle);
      console.log('validate error:', validate);
      if(validate.error)
        return res.json({ error: validate.error });

      const [ row, column ] = coordinate.split('');
      console.log('row', row, 'column', column);
      if(!solver.checkCoordinate(row, column) || 
        !(0 < coordinate.length &&
        coordinate.length < 3)
      ){
        console.log('Bad coordinate');
        return res.json({ error: 'Invalid coordinate'});
      }
      if(!solver.checkValue(value))
        return res.json({ error: 'Invalid value' });

      const rowNum = solver.getChar2num(row);
      const col = +column -1;

      const rowResult = solver.checkRowPlacement(puzzle, rowNum, col, value);
      console.log('rowResult =', rowResult);
      const colResult = solver.checkColPlacement(puzzle, rowNum, col, value);
      console.log('colResult =', colResult);
      const regResult = solver.checkRegionPlacement(puzzle, rowNum, col, value);
      console.log('regResult =', regResult);
      
      if(rowResult && colResult && regResult)
        res.json({ valid: true });
      else
        res.json({ 
          valid: false, 
          conflict: ["row", "column", "region"].filter(value => {
            console.log('switch value:', value)
            switch(value) {
              case "row": 
                console.log("row",rowResult);
                return !rowResult;
              case "column": 
                console.log("column",colResult);
                return !colResult;
              case "region": 
                console.log("region",regResult);
                return !regResult;
            }
          })
        })
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      console.log('/api/solve req.body', req.body);
      const { puzzle } = req.body;
      if(puzzle === undefined)
        return res.json({ error: 'Required field missing' });

      const validate = solver.validate(puzzle);
      // console.log('validate error:', validate);
      if(validate.error)
        return res.json({ error: validate.error });

      const { solution, error} = solver.solve(puzzle);
      if(error)
        return res.json({error});
      res.json({ solution });
    });
};

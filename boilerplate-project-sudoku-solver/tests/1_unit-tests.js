const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver;

suite('Unit Tests', () => {
  solver = new Solver();
  suite('Logic handles', () => {
    const validPuzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    test('a valid puzzle string of 81 characters', (done) => {
      assert.isNull(solver.validate(validPuzzle).error);
      done();
    });

    test('a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47.A.8..1..16....926914.37.';
      assert.equal(solver.validate(invalidPuzzle).error, 'Invalid characters in puzzle');
      done();
    });

    test('a puzzle string that is not 81 characters in length', (done) => {
      const puzzle82 = '5689137243426875191972543866854792312195384677341628959263451784738916528517269432';
      assert.equal(solver.validate(puzzle82).error, 'Expected puzzle to be 81 characters long');
      done();
    });

    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    test('a valid row placement', done => {
      assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, '8'));
      done();
    });

    test('an invalid row placement', done => {
      console.log(solver.checkRowPlacement(puzzle, 0, 1, 2));
      assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '2'));
      done();
    });

    test('a valid column placement', done => {
      assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '3'));
      done();
    });

    test('an invalid column placement', done => {
      assert.isFalse(solver.checkColPlacement(puzzle, 0, 1, '2'));
      done();
    });

    test('a valid region (3x3 grid) placement', done => {
      assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 1, '2'));
      done();
    });

    test('an invalid region (3x3 grid) placement', done => {
      assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '3'));
      done();
    });
  });

  test('Valid puzzle strings pass the solver', done => {
    puzzlesAndSolutions.forEach( puzzle => {
      assert.equal(solver.solve(puzzle[0]).solution, puzzle[1]);
    });
    done();
  });

  test('Invalid puzzle strings fail the solver', done => {
    const invalidPuzzle = '5..9137233...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    assert.equal(solver.solve(invalidPuzzle).error, 'Puzzle cannot be solved');
    done();
  });

  test('Solver returns the expected solution for an incomplete puzzle', done => {
    puzzlesAndSolutions.forEach( puzzle => {
      assert.equal(solver.solve(puzzle[0]).solution, puzzle[1]);
    });
    done();
  });
});

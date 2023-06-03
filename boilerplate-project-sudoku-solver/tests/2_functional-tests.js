const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Solve a puzzle', () => {
    test('with valid puzzle string: POST request to /api/solve', done => {
      const uncompletePuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: uncompletePuzzle })
        .end((err, res) => {
          assert.equal(res.body.solution, solution);
          done();
        });
    });

    test('with missing puzzle string: POST request to /api/solve', done => {
      const puzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const output = 'Required field missing';
      chai.request(server)
        .post('/api/solve')
        .send({ nopuzzle: puzzle })
        .end((err, res) => {
          assert.equal(res.body.error, output);
          done();
        });
    });

    test('with invalid characters: POST request to /api/solve', done => {
      const input = 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const output = 'Invalid characters in puzzle';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.body.error, output);
          done();
        });
    });

    test('with incorrect length: POST request to /api/solve', done => {
      const inputs = [
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.',
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...'
      ];
      const output = 'Expected puzzle to be 81 characters long';
      inputs.forEach(input => {
        chai.request(server)
          .post('/api/solve')
          .send({ puzzle: input })
          .end((err, res) => {
            assert.equal(res.body.error, output);
          });
      });
      done();
    });

    test('that cannot be solved: POST request to /api/solve', done => {
      const input = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const output = 'Puzzle cannot be solved';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input})
        .end((err, res) => {
          assert.equal(res.body.error, output);
          done();
        });
    });
  });

  suite('Check a puzzle placement with', () => {
    test('all fields: POST request to /api/check', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1';
      const value = '7';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end((err, res) => {
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('single placement conflict: POST request to /api/check', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1';
      const value = '6';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end((err, res) => {
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'column');
        });
        done();
    });

    test('multiple placement conflicts: POST request to /api/check', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1';
      const value = '1';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end((err, res) => {
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
        });
        done();
    });

    test('all placement conflicts: POST request to /api/check', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'B3';
      const value = '2';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end((err, res) => {
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
        });
        done();
    });

    test('missing required fields: POST request to /api/check', done => {
      const inputs = [
        {
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          value: '1',
        },
        {
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A1',
        },
        {
          coordinate: 'A1',
          value: '1'
        }
      ];
      const output = 'Required field(s) missing';
      inputs.forEach(input => {
        chai.request(server)
          .post('/api/check')
          .send(input)
          .end((err, res) => {
            assert.property(res.body, 'error');
            assert.equal(res.body.error, output);
          });
      });
      done();
    });

    test('invalid characters: POST request to /api/check', done => {
      const input = 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1';
      const value = '1';
      const output = 'Invalid characters in puzzle';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end((err, res) => {
          assert.property(res.body, 'error');
          assert.equal(res.body.error, output);
        });
        done()
    });

    test('incorrect length: POST request to /api/check', done => {
      const inputs = [
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.',
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...'
      ];
      const coordinate = 'A1';
      const value = '1';
      const output = 'Expected puzzle to be 81 characters long';
      inputs.forEach(input => {
        chai.request(server)
          .post('/api/check')
          .send({ puzzle: input, coordinate, value })
          .end((err, res) => {
            assert.property(res.body, 'error');
            assert.equal(res.body.error, output);
          });
      });
      done();
    });

    test('invalid placement coordinate: POST request to /api/check', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const output = 'Invalid coordinate';
      const coordinates = ['A0', 'A10', 'J1', 'A', '1', 'XZ18'];
      const value = '7';
      coordinates.forEach( coordinate => {
        chai.request(server)
          .post('/api/check')
          .send({ puzzle: input, coordinate, value})
          .end((err, res) => {
            assert.property(res.body, 'error');
            assert.equal(res.body.error, output);
          });
      });
      done();
    });

    test('invalid placement value: POST request to /api/check', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const output = 'Invalid value';
      const coordinate = 'A1';
      const values = ['0', '10', 'A'];
      values.forEach( value => {
        chai.request(server)
          .post('/api/check')
          .send({ puzzle: input, coordinate, value })
          .end((err, res) => {
            assert.property(res.body, 'error');
            assert.equal(res.body.error, output);
          });
      });
      done();
    });
  }); 
});


const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  suite('Test GET /api/convert,', () => {
    // #1
    test('convert a valid input such as 10L', (done) =>{
      const input = "10L";
      chai
        .request(server)
        .get(`/api/convert?input=${input}`)
        .end( (err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', 'Response should be json');
            assert.equal(res.body.initNum, 10);
            assert.equal(res.body.initUnit, 'L');
            assert.equal(res.body.returnNum, 2.64172);
            assert.equal(res.body.returnUnit, 'gal');
            assert.equal(res.body.string, '10 liters converts to 2.64172 gallons');
            done();
          });
    });
    // #2
    test('Convert an invalid input such as 32g', (done) => {
      const input = '32g';
      chai
        .request(server)
        .get(`/api/convert?input=${input}`)
        .end( (err, res) => {
          assert.equal(res.text, "invalid unit");
          done();
        });
    });
    // #3
    test('Convert an invalid number such as 3/7.2/4kg', (done) => {
      const input = '3/7.2/4kg';
      chai
        .request(server)
        .get(`/api/convert?input=${input}`)
        .end( (err, res) => {
          assert.equal(res.text, "invalid number");
          done();
        });
    });
    // #4
    test('Convert an invalid number AND unit such as 3/7.2/4kilomegagram', (done) => {
      const input = '3/7.2/4kilomegagram';
      chai
        .request(server)
        .get(`/api/convert?input=${input}`)
        .end( (err, res) => {
          assert.equal(res.text, "invalid number and unit");
          done();
        });
    });
    // #5
    test('Convert with no number such as kg', (done) => {
      const input = 'kg';
      chai
        .request(server)
        .get(`/api/convert?input=${input}`)
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', 'Response should be json');
          assert.equal(res.body.initNum, 1);
          assert.equal(res.body.initUnit, 'kg');
          assert.equal(res.body.returnNum, 2.20462);
          assert.equal(res.body.returnUnit, 'lbs');
          assert.equal(res.body.string, '1 kilograms converts to 2.20462 pounds');
          done();
        });
    });
  });

});

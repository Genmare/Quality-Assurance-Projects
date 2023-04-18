const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  suite('ConvertHandler should correctly', () => {
    // #1
    test('read a whole number input', () => {
      assert.strictEqual(
        convertHandler.getNum("4gal"),
        4
      );
    });
    // #2
    test('read a decimal number input', () => {
      assert.strictEqual(
        convertHandler.getNum("5.4kg"),
        5.4
      );
    });
    // #3
    test('read a fractional input', () => {
      assert.strictEqual(
        convertHandler.getNum("1/2km"),
        0.5
      );
    });
    // #4
    test('read a fractional input with a decimal', () => {
      assert.strictEqual(
        convertHandler.getNum("5.4/3lbs"),
        1.8
      );
    });
    // #5
    test('return an error on a double-fraction', () => {
      assert.strictEqual(
        convertHandler.getNum("3/2/3L"),
        undefined
      );
    });
    // #6
    test('default to a numerical input of 1 when no numerical input is provided', () => {
      assert.strictEqual(
        convertHandler.getNum("kg"),
        1
      );
    });
    // #7
    test('read each valid input unit', () => {
      assert.strictEqual(convertHandler.getUnit("5kg"), "kg");
      assert.strictEqual(convertHandler.getUnit("4gal"), "gal");
      assert.strictEqual(convertHandler.getUnit("2.3lbs"), "lbs");
      assert.strictEqual(convertHandler.getUnit("2L"), "L");
    });
    // #8
    test('return an error for an invalid input unit', () => {
      assert.strictEqual(convertHandler.getUnit("5kl"), undefined);
    });
    // #9
    test('return the correct return unit for each valid input unit', () => {
      assert.strictEqual(convertHandler.getReturnUnit("km"), "mi");
      assert.strictEqual(convertHandler.getReturnUnit("mi"), "km");
      assert.strictEqual(convertHandler.getReturnUnit("gal"), "L");
      assert.strictEqual(convertHandler.getReturnUnit("L"), "gal");
      assert.strictEqual(convertHandler.getReturnUnit("lbs"), "kg");
      assert.strictEqual(convertHandler.getReturnUnit("kg"), "lbs");
    });
    // #10
    test('return the spelled-out string unit for each valid input unit', () => {
      assert.strictEqual(convertHandler.spellOutUnit("km"), "kilometers");
      assert.strictEqual(convertHandler.spellOutUnit("mi"), "miles");
      assert.strictEqual(convertHandler.spellOutUnit("gal"), "gallons");
      assert.strictEqual(convertHandler.spellOutUnit("L"), "liters");
      assert.strictEqual(convertHandler.spellOutUnit("lbs"), "pounds");
      assert.strictEqual(convertHandler.spellOutUnit("kg"), "kilograms");
    });
    // #11
    test('convert gal to L', () => {
      assert.strictEqual(convertHandler.convert(4, 'gal'), 15.14164);
    });
    // #12
    test('convert L to gal', () => {
      assert.strictEqual(convertHandler.convert(2, 'L'), 0.52834);
    });
    // #13
    test('convert mi to km', () => {
      assert.strictEqual(convertHandler.convert(10, 'mi'), 16.09340);
    });
    // #14
    test('convert km to mi', () => {
      assert.strictEqual(convertHandler.convert(1/2, 'km'), 0.31069);
    });
    // #15
    test('convert lbs to kg', () => {
      assert.strictEqual(convertHandler.convert(5.4/3, 'lbs'), 0.81647);
    });
    // #16
    test('convert kg to lbs', () => {
      assert.strictEqual(convertHandler.convert(1, 'kg'), 2.20462);
    });
  });

});
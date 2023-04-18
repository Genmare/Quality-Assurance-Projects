function ConvertHandler() {
  
  // this.Units = ['km', 'mi', 'gal', 'l', 'lbs', 'kg'];
  this.Units = ['km', 'mi', 'gal', 'L', 'lbs', 'kg'];
  this.spelledUnit = {
    km: 'kilometers',
    mi: 'miles',
    gal: 'gallons',
    L: 'liters', 
    lbs: 'pounds',
    kg: 'kilograms'
  }

  this.getNum = function(input) {
    let result;
    const regex = /(^\d+\.?\d*\/\d+\.?\d*)[a-zA-Z]+|(^\d*\.?\d*)[a-zA-Z]+/m;
    const match = input.match(regex);

    // console.log('\nmatch', match)
    if(match === null) return undefined;
    let i = match[1] !== undefined ? 1 : 2;
    result = match[i] === ''? 1 : eval(match[i]);
    return result;
  };
  
  this.getUnit = function(input) {
    let result;
    const regex = /[a-zA-Z]/g;
    const found = input.match(regex);
    result = found.join('');
    console.log('getUnit unité', result);
    // result = this.Units.includes(result.toLowerCase()) ? result : undefined;
    result = this.Units.find(unit => unit.toLocaleLowerCase() === result.toLowerCase()) ?? undefined;
    console.log('getUnit unité après l\'include', result);
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    let result;
    switch (initUnit.toLowerCase()) {
      case 'km':
        result = 'mi';
        break;
      case 'mi':
        result = 'km';
        break;
      case 'gal':
        result = 'L';
        break;
      case 'l':
        result = 'gal';
        break;
      case 'lbs':
        result = 'kg';
        break;
      case 'kg':
        result = 'lbs';
        break;
      default:
        resul = 'invalid number';
    }
    return result;
  };

  this.spellOutUnit = function(unit) {    
    return this.spelledUnit[unit];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    switch (initUnit) {
      case 'km':
        result = initNum / miToKm;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      default:
        resul = 'invalid number';
    }

    return +result.toFixed(5);
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result;
    result = `${initNum} ${initUnit} converts to ${returnNum} ${returnUnit}`;
    return result;
  };
  
}

module.exports = ConvertHandler;

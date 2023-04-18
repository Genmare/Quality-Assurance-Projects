'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();
  // const val1 = '5.4/3lbs';
  const val1 = '3/2/3L';
  console.log(`getNum de ${val1}: `, convertHandler.getNum(val1));
  console.log(`getUnit de ${val1}: `, convertHandler.getUnit(val1));
  const val2 = "1/2km;"
  console.log(`getNum de ${val2} : `, convertHandler.getNum(val2));
  console.log(`getUnit de ${val2}: `, convertHandler.getUnit(val2));
  const val3 = "3/7.2/4kg"
  console.log(`getNum de ${val3} : `, convertHandler.getNum(val3));
  console.log(`getUnit de ${val3}: `, convertHandler.getUnit(val3), '\n');
  const val4 = "5km"
  console.log(`getNum de ${val4} : `, convertHandler.getNum(val4));
  console.log(`getUnit de ${val4}: `, convertHandler.getUnit(val4), '\n');

  // console.log('getNum de kt', convertHandler.getUnit('kt'));
  console.log('getUnit de kt', convertHandler.getUnit('kt'));

  console.log('spellOutUnit de lbs', convertHandler.spellOutUnit('lbs'));

  const initNum = convertHandler.getNum(val2);
  const initUnit = convertHandler.getUnit(val2);
  const returnNum = convertHandler.convert(initNum, initUnit);
  const returnUnit = convertHandler.spellOutUnit(convertHandler.getReturnUnit(initUnit));
  console.log(`\n getString de ${val2}: `, 
    convertHandler.getString(initNum, convertHandler.spellOutUnit(initUnit), returnNum , returnUnit));

  app.route('/api/convert')
    .get( (req,res) => {
      let error = null;
      const input = req.query.input;
      console.log(`/api/convert?input=${input}`);
      let initNum = convertHandler.getNum(input);
      if(initNum === undefined)
        error = 'invalid number';
      else
        initNum = +initNum;
      const initUnit = convertHandler.getUnit(input);
      if(initUnit === undefined)
        error = error? error + ' and unit' : 'invalid unit';
      // console.log(`initNum=${initNum}, initUnit=${initUnit}, error=${error}`);
      if(error)
        res.send(error);
      else {
        const returnNum = convertHandler.convert(initNum, initUnit);
        const returnUnit = convertHandler.getReturnUnit(initUnit);
        const returnStr = convertHandler.getString(initNum, convertHandler.spellOutUnit(initUnit), returnNum , convertHandler.spellOutUnit(returnUnit));

        res.json({
          initNum,
          initUnit,
          returnNum,
          returnUnit,
          string: returnStr
        });
      }
    })
    app.route('/api/convert').post( (req, res) => {
      const input = req.body.input;
      console.log('post input', input);
    });
};

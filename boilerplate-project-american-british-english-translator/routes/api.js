'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      console.log('/api/translate res.body', req.body);
      const { text, locale } = req.body;
      if(text == null || locale == null)
        return res.json({ error: 'Required field(s) missing' });
        
      if(text === '')
        return res.json({ error: 'No text to translate' });
      console.log('après No text to translate')

      if(!['american-to-british', 'british-to-american'].includes(locale))
        return res.json({ error: 'Invalid value for locale field' });
        

      let translation = translator.translate(text, locale);
      if(text === translation)
        translation = "Everything looks good to me!";
        
      res.json({ text, translation }); 
    });
};

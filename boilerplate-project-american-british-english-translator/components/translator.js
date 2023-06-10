const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

  constructor(){
    this.britishToAmericanSpelling = 
      Object.entries(americanToBritishSpelling)
            .reduce((newObj, pair) => {
              newObj[pair[1]] = pair[0];
              return newObj;
            }, {});

    this.britishToAmericanTitles = 
      Object.entries(americanToBritishTitles)
          .reduce((newObj, pair) => {
            newObj[pair[1]] = pair[0];
            return newObj;
          }, {});
  }

  getLongestWord(words){
    let word;
    let size = words[0].text.length;
    words.forEach(w => {
      if(w.text.length >= size){
        size = w.text.length;
        word = w.capitalize ? w.translation.charAt(0).toUpperCase() + w.translation.slice(1) : w.translation;
      }
    });
    return word;
  }

  translate(text, locale) {
    console.log('input text :', text, ' locale :', locale);
    let result = '';
    switch(locale) {
      case 'american-to-british': 
        result = this.translateTo(text, 'american-to-british');
        break;
      case 'british-to-american':
        result = this.translateTo(text, 'british-to-american');
    }

    console.log('result :', result);
    return result;
  }

  translateTo(text, locale){
    const splitText = text.split(/\s?(\w+'?\w*)\s?(\d+.\d+)?\s?/gm).filter(w => w !== ' ' && w !== '' && w !== undefined);
    let newText = '';
    let reg;
    let finded = false;
    let translate = [];
    let compoundSize = 1;
    let langArray;
    let hour;
    let i;
    let word_s;

    const languageOnly = locale === 'american-to-british' ? americanOnly : britishOnly;
    const languageToTranslateSpelling = locale === 'american-to-british' ? americanToBritishSpelling : this.britishToAmericanSpelling;
    const languageToTranslateTitles = locale === 'american-to-british' ? americanToBritishTitles : this.britishToAmericanTitles;
    const hourSeparator = locale === 'american-to-british' ? '.' : ':';

    const wordNum = splitText.length;
    splitText.forEach((word, index, array) => {
      finded = false;
      translate = [];
      if(compoundSize < 2){
        if(/[^,? ]/.test(word)){
          for (const lang in languageOnly) {
            // for compound words
            langArray = lang.split(' ');
            i = 1;
            word_s = word;
            while(i < langArray.length){
              word_s += ' ' + array[index+i];
              i++;
            }
            reg = new RegExp(`^${word_s}$`, 'i');

            if( reg.test(lang) ){
              translate.push({
                text: lang, 
                translation: languageOnly[lang],
                capitalize: false
              });
              finded = true;
              if(langArray.length > 1 && compoundSize < langArray.length)
                compoundSize = langArray.length;
            }
          }
          for (const lang in languageToTranslateSpelling) {
            langArray = lang.split(' ');
            reg = new RegExp(`^${word}$`, 'i');

            if( reg.test(langArray[0]) ){
              translate.push({
                text: lang, 
                translation: languageToTranslateSpelling[lang],
                capitalize: false
              });
              finded = true;
              if(langArray.length > 1)
                compoundSize = langArray.length;
            }
          }
          for (const lang in languageToTranslateTitles) {
            langArray = lang.split('.');
            reg = new RegExp(`${langArray[0]}\w*`, 'i')
            if( reg.test(word) ){
              translate.push({
                text: lang, 
                translation: languageToTranslateTitles[lang],
                
                capitalize: /[A-Z]/.test(word[0])
              });
              finded = true;
              if(langArray.length > 1)
                compoundSize = langArray.length;
            }
          }

          // to manage locale hour
          hour = null;
          hour = locale === 'american-to-british' ? word.match(/(\d+):(\d+)/) : word.match(/(\d+)\.(\d+)/);
          if(hour)
            finded = true;

          // if translated word finded
          if (finded) {
            if(!hour)
              newText += '<span class="highlight">'+this.getLongestWord(translate)+'</span>';
            else
              newText += '<span class="highlight">'+hour[1]+ hourSeparator +hour[2]+'</span>';
          } else {
            newText += word;
          }

          // add space between
          let colon = [','].includes(array[index+1]);
          if(index < wordNum-compoundSize-1 && !colon)
            newText += ' ';
        } else {
          newText += index < splitText.length-1? word + ' ': word;  // if the last word, don't add a space
        }
        
      } else compoundSize -= 1;   // ignore words that belong to a compound word
    });
    return newText;
  }
}

module.exports = Translator;
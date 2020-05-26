/**
 * @author: Basilio Gómez Navarro
 * @since: 07/05/2020
 * Universidad de La Laguna
 * Subject: Advanced Artificial Intelligence
 * Escuela Superior de Ingeniería y Tecnología
 * Computer Ingenieering Degree
 * Grade: 3rd
 * Project: Classification of Texts in Natural Language.
 * Email: alu0101049151@ull.edu.es
 * @desc: tokenizator-p1.js file: Contains an implementation of a lexical analyzer
 *        that, from an input file with data, generates a dictionary with.
 *
 * References:
 *
 * Project statement:
 * @link https://campusvirtual.ull.es/ingenieriaytecnologia/mod/resource/view.php?id=248911
 *
 * Version History
 *                   07/05/2020 - Creation (first version) of the code.
 */
'use strict';


const fs = require('fs');

// // Saves in the 'myArgs' array only the two numbers given by command line.
// const myArgs = process.argv.slice(2);

// // Stores the first value and converts it to number type.
// const inputFile = myArgs[0];

const NEWLINE = /\r\n|\r|\n/;
const REPLACE = /\W/g;
const NUMBER_OR_SPACE = /^(.*)?\d+(.*)?$|^\s*$/;

const CEBO = 'cebo';
const NOCEBO = 'nocebo';
const UTF8 = 'utf8';
const SPACE = ' ';
const N_LINE = '\n';
const COMMA = ',';
const OUTPUT_FILE = 'vocabulario.txt';
const INPUT_FILE = 'cebo_train.csv';

/**
 * @desc Reads a file from the input name given by commandline and generate an
 * object for each line, to store the statement and the tag "cebo/nocebo" of
 * each line.
 * @param {String} fileName Is the file name to read data from.
 */
function fileReader(fileName) {
  let copy = [];
  fs.readFile(fileName, UTF8, (err, content) => {
    if (err) {
      return console.error(err);
    }
    const data = content.split(NEWLINE);
    const finalStrings = [];
    for (const currentString of data) {
      if (currentString !== '') {
        const currentLine = {};
        let currentTag = '';

        const commaPosition = currentString.indexOf(COMMA);
        copy = currentString.substr(0, commaPosition);
        currentTag = currentString.substr(commaPosition + 1);

        // Checks that currentTag is 'cebo' or 'nocebo'
        while ((currentTag !== CEBO) && (currentTag !== NOCEBO)) {
          const newCommaPosition = currentTag.indexOf(COMMA);
          const auxLimit = commaPosition + newCommaPosition + 2;
          const newCopy = currentString.substr(0, auxLimit);
          copy = newCopy;
          currentTag = currentString.substr(auxLimit);
        }

        currentLine.content = copy;
        // currentLine.tag = currentTag;
        finalStrings.push(currentLine);
      }
    }
    console.log(finalStrings);
    getTokens(finalStrings);
  });
}

/**
 * @desc Gets the tokens of the strings.
 * @param {Array} array Is the array with the strings without the
 * ",cebo/nocebo".
 */
function getTokens(array) {
  let spaceString = '';
  let tokensArray = [];
  for (const currentString of array) {
    spaceString = currentString.content.replace(REPLACE, SPACE);
    const auxArray = spaceString.split(SPACE);
    tokensArray = tokensArray.concat(auxArray);
  }

  const finalTokens = [];
  for (const currentToken of tokensArray) {
    if (!NUMBER_OR_SPACE.test(currentToken) &&
    (!finalTokens.includes(currentToken))) {
      finalTokens.push(currentToken);
    }
  }

  finalTokens.sort((a, b) => a.
      localeCompare(b, undefined, {sensitivity: 'base'}));

  const stream = fs.createWriteStream(OUTPUT_FILE);
  stream.write('Number of words: ' + finalTokens.length + N_LINE);
  for (const currentToken of finalTokens) {
    stream.write(currentToken + N_LINE);
  }
  stream.close();
}

fileReader(INPUT_FILE);

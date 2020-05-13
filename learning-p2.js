/**
 * @author: Basilio Gómez Navarro
 * @since: 11/05/2020
 * Universidad de La Laguna
 * Subject: Advanced Artificial Intelligence
 * Escuela Superior de Ingeniería y Tecnología
 * Computer Ingenieering Degree
 * Grade: 3rd
 * Project: Classification of Texts in Natural Language.
 * Email: alu0101049151@ull.edu.es
 * @desc: learning-p2.js file: Contains the implementation of a program to
 *                          carry out the estimation of the language model.
 *
 * References:
 *
 * Project statement:
 * @link https://campusvirtual.ull.es/ingenieriaytecnologia/mod/resource/view.php?id=248911
 *
 * Version History
 *                   11/05/2020 - Creation (first version) of the code.
 */
'use strict';

const fs = require('fs');

const UTF8 = 'utf8';
const NEWLINE = /\r\n|\r|\n/;
const N_LINE = '\n';

const COMMA = ',';
const CEBO = 'cebo';
const NOCEBO = 'nocebo';

const vocabularyFile = 'vocabulario.txt';
const OUTPUT_FILE = 'aprendizaje.txt';
const TRAIN_FILE = 'cebo_train.csv';

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
    const lines = [];
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
        currentLine.tag = currentTag;
        lines.push(currentLine);
      }
    }
    // console.log(lines);
    wordsCounter(lines);
  });
}

/**
 * @desc Counts the number of occurrences of each word and how many of those
 * occurrences are "cebo" and how many "nocebo"
 * @param {Array} lines Are all the currentLine objects created in the
 * 'fileReader' function.
 */
function wordsCounter(lines) {
  const finalWords = [];
  let cebos = 0;
  let nocebos = 0;
  fs.readFile(vocabularyFile, UTF8, (err, content) => {
    if (err) {
      return console.error(err);
    }

    let counter = 0;
    const words = content.split(NEWLINE);
    for (const currentWord of words) {
      if (counter === 0) {
        counter++;
      } else {
        const wordObject = {};
        wordObject.name = currentWord;
        wordObject.cebo = 0;
        wordObject.nocebo = 0;
        const auxRegex = '\\b' + currentWord + '\\b';
        const currentRegex = new RegExp(auxRegex, 'g');

        for (const currentLine of lines) {
          const match = currentLine.content.match(currentRegex);
          if (match !== null) {
            if (currentLine.tag === CEBO) {
              wordObject.cebo += match.length;
              cebos++;
            } else if (currentLine.tag === NOCEBO) {
              wordObject.nocebo += match.length;
              nocebos++;
            } else {
              console.error('Unexpected tag');
            }
          }
        }
        finalWords.push(wordObject);
      }
    }
    // console.log(finalWords);
    writeResult(finalWords, cebos, nocebos);
    learningLog(lines, finalWords, cebos, nocebos);
  });
}

/**
 * @desc Writes to the output file the result.
 * @param {Array} words The set of objects that contains each word and it's
 * amount o 'cebo' and  'nocebo' occurrences.
 * @param {Number} cebos Totally amount of 'cebos' tokens.
 * @param {Number} nocebos Totally amount of 'nocebos' tokens.
 */
function writeResult(words, cebos, nocebos) {
  const stream = fs.createWriteStream(OUTPUT_FILE);
  stream.write('numtitulares: ' + cebos + ' ' + nocebos + N_LINE);
  for (const currentWord of words) {
    stream.write(currentWord.name + ' ' + currentWord.cebo + ' ' +
    currentWord.nocebo + N_LINE);
  }
  stream.write('<UNK> 0 0');
  stream.close();
}

fileReader(TRAIN_FILE);


// ============================================================================
const OUTPUT_LEARNING = 'aprendizajelog.txt';

/**
 * @desc Generates the logprobtitulares file
 * @param {Array} lines Is the array with all the lines
 * @param {Array} finalWords Is the array with all the words objects
 * @param {Number} cebosWord Is the number of words of 'cebo' type.
 * @param {Number} nocebosWord Is the number of words of 'nocebo' type.
 */
function learningLog(lines, finalWords, cebosWord, nocebosWord) {
  let cebos = 0;
  let nocebos = 0;
  for (const currentLine of lines) {
    if (currentLine.tag === CEBO) {
      cebos++;
    } else if (currentLine.tag === NOCEBO) {
      nocebos++;
    }
  }
  const totalLines = lines.length;
  const ceboTProb = Math.log((cebos / totalLines)).toFixed(4);
  const noceboTProb = Math.log((nocebos / totalLines)).toFixed(4);
  const endCebo = Math.log((cebos + 1) / (cebos + totalLines)).toFixed(4);
  const endNocebo = Math.log((nocebos + 1) / (nocebos + totalLines)).toFixed(4);

  // ···················································
  const stream = fs.createWriteStream(OUTPUT_LEARNING);
  stream.write('logprobtitulares: ' + ceboTProb + ' ' + noceboTProb + N_LINE);

  for (const currentWord of finalWords) {
    const ceboWProb = Math.log((currentWord.cebo + 1) /
    (cebosWord + finalWords.length)).toFixed(4);
    const noceboWProb = Math.log((currentWord.nocebo + 1) /
      (nocebosWord + finalWords.length)).toFixed(4);
    stream.write(currentWord.name + ' ' + ceboWProb + ' ' + noceboWProb +
      N_LINE);
  }
  stream.write('</s> ' + endCebo + ' ' + endNocebo + N_LINE);
  stream.write('<UNK> 0 0');
  stream.close();
}

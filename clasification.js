/**
 * @author: Basilio Gómez Navarro
 * @since: 20/05/2020
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
 *                   20/05/2020 - Creation (first version) of the code.
 */
'use strict';

const fs = require('fs');

const UTF8 = 'utf8';
const SPACE = ' ';
const N_LINE = '\n';
const NEWLINE = /\r\n|\r|\n/;
const TOKEN = /\s+/;
const REPLACE = /\W/g;

const COMMA = ',';
const CEBO = 'cebo';
const NOCEBO = 'nocebo';

const LEARN_LOG_FILE = 'classification-texts-natural-language/aprendizajelog.txt';
const INPUT_FILE = 'cebo_train.csv';
const INPUT_FILE_TEST = '/home/basiliogn/ULL/3º-2ºCuatri/IAA/practica-pln/classification-texts-natural-language/cebo_test_no_class.csv';

/**
 * @desc Reads the file with the vocabulary of the training file.
 */
function readVocabulary() {
  const finalWords = [];
  fs.readFile(LEARN_LOG_FILE, UTF8, (err, content) => {
    if (err) {
      return console.error(err);
    }

    const allWords = content.split(NEWLINE);
    let counter = 0;
    for (const currentWord of allWords) {
      if (counter !== 0) {
        const infoWord = currentWord.split(TOKEN);
        const word = {};
        word.content = infoWord[0];
        word.ceboProbLog = infoWord[1];
        word.noceboProbLog = infoWord[2];
        finalWords.push(word);
      }
      counter++;
    }
    console.log(finalWords);
    testReader(finalWords);
  });
}

/**
 * @desc Reads a file from the input name given by commandline and generate an
 * object for each line, to store the statement and the tag "cebo/nocebo" of
 * each line.
 * @param {String} fileName Is the file name read from the command line.
 */
function testReader(words) {
  let copy = [];

  fs.readFile(INPUT_FILE_TEST, UTF8, (err, content) => {
    if (err) {
      return console.error(err);
    }

    // console.log(words);
    const lines = [];
    const data = content.split(NEWLINE);
    for (const currentString of data) {
      if (currentString !== '') {
        const currentLine = {};

        // New string without any non alpha-numeric character.
        const newStringClear = currentString.replace(REPLACE, SPACE);
        const tokensOfString = newStringClear.split(TOKEN);
        for (const currentToken of tokensOfString) {
          // const found
          // while (!found)
        }

        currentLine.content = copy;
        currentLine.tag = currentTag;
        lines.push(currentLine);
      }
    }
    console.log(lines);
    // wordsCounter(lines);
  });
}

readVocabulary();

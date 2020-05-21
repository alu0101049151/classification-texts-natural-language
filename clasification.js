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

const LEARN_LOG_FILE = 'aprendizajelog.txt';
const INPUT_FILE_TEST = 'cebo_test_no_class.csv';
const OUTPUT_FILE = 'clasificacion_alu0101049151.csv';

/**
 * @desc Reads the file with the vocabulary of the training file.
 */
function readVocabulary() {
  const finalWords = []; // Will contains each word with its probabilities.
  fs.readFile(LEARN_LOG_FILE, UTF8, (err, content) => {
    if (err) {
      return console.error(err);
    }

    const allWords = content.split(NEWLINE);
    const firstData = allWords[0].split(TOKEN);
    const totalLog = {};
    totalLog.cebo = firstData[1];
    totalLog.nocebo = firstData[2];

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
    testReader(finalWords, totalLog);
  });
}

/**
 * @desc Reads a file from the input name given by commandline and generate an
 * object for each line, to store the statement and the tag "cebo/nocebo" of
 * each line.
 * @param {Array} words Is the array with all the words of the vocabulary.
 * @param {Array} totalLog are the logarithm value of the probability of bait
 * and non-bait respectively.
 */
function testReader(words, totalLog) {
  // Read the file with the input to test.
  fs.readFile(INPUT_FILE_TEST, UTF8, (err, content) => {
    if (err) {
      return console.error(err);
    }

    const finalHeadLines = [];
    const data = content.split(NEWLINE);
    for (const currentString of data) {
      if (currentString !== '') {
        const currentLine = {};
        currentLine.content = currentString;

        // New string without any non alpha-numeric character.
        const newStringClear = currentString.replace(REPLACE, SPACE);
        // Tokens of the sentence.
        const tokensOfString = newStringClear.split(TOKEN);
        let totalCebo = parseFloat(totalLog.cebo);
        let totalNoCebo = parseFloat(totalLog.nocebo);

        const ceboUnk = parseFloat(words[words.length - 2].ceboProbLog);
        const noceboUnk = parseFloat(words[words.length - 2].noceboProbLog);
        for (const currentToken of tokensOfString) {
          let found = false;
          let count = 0;
          while (!found && (count < words.length)) {
            if (words[count].content === currentToken) {
              found = true;
              totalCebo += parseFloat(words[count].ceboProbLog);
              totalNoCebo += parseFloat(words[count].noceboProbLog);
            }
            count++;
          }
          if (!found) {
            totalCebo += ceboUnk;
            totalNoCebo += noceboUnk;
          }
        }
        currentLine.cebo = totalCebo.toFixed(2);
        currentLine.nocebo = totalNoCebo.toFixed(2);
        finalHeadLines.push(currentLine);
      }
    }
    clasify(finalHeadLines);
  });
}

/**
 * @desc Classifies the headlines in "cebo" or "nocebo".
 * @param {Array} finalHeadLines Classifies the final headlines.
 */
function clasify(finalHeadLines) {
  const stream = fs.createWriteStream(OUTPUT_FILE);
  for (const currentLine of finalHeadLines) {
    let tag = '';
    if (currentLine.cebo > currentLine.nocebo) {
      tag = CEBO;
    } else {
      tag = NOCEBO;
    }
    stream.write(currentLine.content + ' ' + currentLine.cebo + ' ' +
    currentLine.nocebo + ' ' + tag + N_LINE);
  }
}

readVocabulary();

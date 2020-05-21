'use strict';

const fs = require('fs');

const UTF8 = 'utf8';
const NEWLINE = /\r\n|\r|\n/;
const N_LINE = '\n';

const COMMA = ',';
const CEBO = 'cebo';
const NOCEBO = 'nocebo';

const vocabularyFile = 'vocabulario.txt';
const OUTPUT_FILE = 'cebo_train_no_tags.csv';
const TRAIN_FILE = 'cebo_train.csv';


/**
 * @desc Reads a file from the input name given by commandline and generate an
 * object for each line, to store the statement and the tag "cebo/nocebo" of
 * each line.
 * @param {String} fileName Is the file name to read data from.
 */
function fileReader(fileName, finalHeadLines) {
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
    writeResult(lines);
  });
}

/**
 * @desc Writes to the output file the result.
 * @param {Array} words The set of objects that contains each word and it's
 * amount o 'cebo' and  'nocebo' occurrences.
 * @param {Number} cebos Totally amount of 'cebos' tokens.
 * @param {Number} nocebos Totally amount of 'nocebos' tokens.
 */
function writeResult(lines) {
  const stream = fs.createWriteStream(OUTPUT_FILE);
  for (const currentLine of lines) {
    stream.write(currentLine.content + N_LINE);
  }
  // stream.write('<UNK> 0 0');
  stream.close();
}

fileReader(TRAIN_FILE);

// Entry program (program/v1, Node 22): read every case from the input
// directory, answer each one with run() from solve.js, and write the
// answers as a JSON array to the output directory, in case order.
// Input/output locations default to /input and /output; the harness may
// override them with MAKEFUN_INPUT_DIR / MAKEFUN_OUTPUT_DIR.
//
// The answers are stringified one case at a time and written in chunks:
// building one 11 MB string first costs more than the per-case calls,
// and the bytes written are identical either way.
import { setFlagsFromString } from 'node:v8';
import { closeSync, mkdirSync, openSync, readFileSync, writeSync } from 'node:fs';
import { join } from 'node:path';
import { run } from './solve.js';

setFlagsFromString('--no-incremental-marking');

const inputDir = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const cases = JSON.parse(readFileSync(join(inputDir, 'cases.json'), 'utf8'));
const answers = new Array(cases.length);
for (let i = 0; i < cases.length; i++) answers[i] = run(cases[i].input);
mkdirSync(outputDir, { recursive: true });
const fd = openSync(join(outputDir, 'answers.json'), 'w');
try {
  writeSync(fd, '[');
  for (let i = 0; i < answers.length; i++) {
    if (i > 0) writeSync(fd, ',');
    writeSync(fd, JSON.stringify(answers[i]));
  }
  writeSync(fd, ']');
} finally {
  closeSync(fd);
}

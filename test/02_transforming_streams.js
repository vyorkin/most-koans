import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('the map transformation relates a stream to another', t => {
  let result = '';
  const names = ['wE', 'hOpE', 'yOU', 'aRe', 'eNJoyIng', 'tHiS'];
  return most.from(names)
    .map(x => x.toLowerCase())
    .observe(x => { result += x + ' ' })
    .then(() => t.is('we hope you are enjoying this ', result));
});

test('you can create a new stream by replacing each event with a constant', t => {
  let result = [];
  return most.from([1, 2, 3])
    .constant(6)
    .forEach(x => { result.push(x) })
    .then(() => t.deepEqual([6, 6, 6], result));
});

test('scan emits incremental results', t => {
  const letters = ['a', 'b', 'c'];
  let result = [];
  return most.from(letters)
    .scan((acc, letter) => acc + letter, '')
    .observe(x => { result.push(x) })
    .then(() => t.deepEqual(['', 'a', 'ab', 'abc'], result));
});

test('chain is a cartesian product', t => {
  // stream:            -a----b----c|
  //
  // f(a):               1--2--3|
  // f(b):                    1----2----3|
  // f(c):                           1-2-3|
  //
  // stream.chain(f):   -1--2-13---2-1-233|
  t.pass();
});

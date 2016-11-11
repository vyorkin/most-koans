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

test('chain may be a cartesian product', t => {
  // stream:   12|
  // f(1):     1---1---1---1---1|
  // f(2):      2-------2-------2-------2-------2|
  // chain(f): 12--1---12--1---12-------2-------2|

  let result = [];
  return most.from([1, 2]).chain( // alias: flatMap
      x => most.periodic(x * 25)
        .take(5)
        .constant(x)
        .delay(x - 1)
    )
    .observe(x => { result.push(x) })
    .then(() => t.deepEqual([1, 2, 1, 1, 2, 1, 1, 2, 2, 2], result));
});

test('and the beginning may end, and the ending begin', t => {
  let result = [];
  return most.from(['a', 'b', 'c'])
    .continueWith(() => most.iterate(x => x + 1, 1).take(3))
    .observe(x => { result.push(x) })
    .then(() => t.deepEqual(['a', 'b', 'c', 1, 2, 3], result));
});

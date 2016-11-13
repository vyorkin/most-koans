import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('you guessed it right - you can slice streams', t => {
  return most.from('kusai za huy')
    .slice(9, 12)
    .reduce((str, l) => str + l, '')
    .then(str => t.is('huy', str));
});

test('but a lazy person will find an easy way', t => {
  return most.from([1, 2, 3, 4, 5])
    .take(3)
    .reduce((sum, x) => sum += x, 0)
    .then(sum => t.is(6, sum));
});

test('things may be skipped', t => {
  return most.from([1, 2, 3, 4, 5])
    .skip(3)
    .reduce((sum, x) => sum += x, 0)
    .then(sum => t.is(9, sum));
});

test('you may use a predicate instead of a count', t => {
  return most.from([1, 2, 3, 4, 5])
    .skipWhile(x => x < 3)
    .reduce((acc, x) => acc * x, 1)
    .then(product => t.is(60, product));
});

test('use a takeWhile to do the opposite thing', t => {
  return most.periodic(10, 3)
    .scan((acc, x) => acc * x, 1)
    .takeWhile(product => product < 15)
    .observe(x => x)
    .then(product => t.is(27, product));
});

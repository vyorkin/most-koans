import test from 'ava';
import * as most from 'most';
import { run } from 'most-test';
import { identity } from 'ramda';

const __ = 'Fill in the blank';

test('you guessed it right - you can slice streams', async t => {
  const result = await most.from('kusai za huy')
    .slice(9, 12)
    .reduce((str, l) => str + l, '');

  t.is('huy', result);
});

test('there is always an easier way', async t => {
  const sum = await most.from([1, 2, 3, 4, 5])
    .take(3)
    .reduce((acc, x) => acc + x, 0);

  t.is(6, sum);
});

test('things may be skipped', async t => {
  const sum = await most.from([1, 2, 3, 4, 5])
    .skip(3)
    .reduce((acc, x) => acc + x, 0);

  t.is(9, sum);
});

test('you may use a predicate instead of a count', async t => {
  const product = await most.from([1, 2, 3, 4, 5])
    .skipWhile(x => x < 3)
    .reduce((acc, x) => acc * x, 1);

  t.is(60, product);
});

test('use a takeWhile to do the opposite thing', async t => {
  // source: 3--03--03--03--03--03-->
  // time:   0--10--20--30--40--50-->
  // scan:   1--09--27--81-->
  // result: 1--09--27|

  const stream = most.periodic(10, 3)
    .scan((acc, x) => acc * x, 1)
    .takeWhile(product => product < 15);

  const result = await run(stream).tick(20);

  t.is(result.end.value, 27);
});

test('another stream may be a signal to stop', async t => {
  // source: 2----4----8---016--032--064|
  // time:   0---050--100--150--200--250-->
  // end:    ---------------any(151ms)|
  // result: 2----4----8---016|

  const numbers = [2, 4, 8, 16, 32, 64];

  const source = most.from(numbers).zip(identity, most.periodic(50));
  const signal = most.of(1).delay(151);
  const stream = source.until(signal); // alias: takeUntil
  const result = await run(stream).tick(200);

  t.deepEqual([2, 4, 8, 16], result.events);
});

test('or a signal to start', async t => {
  // source:      1----1----1----1----1----1----1----1----1----1|
  // time:        0---050--100--150--200--250-->
  // end:         --------------------any(201ms)|
  // until(end):  -------------------------1----1----1----1----1|

  const source = most.periodic(50, 1).take(10);
  const signal = most.of(1).delay(201);
  const stream = source.since(signal); // alias: skipUntil
  const result = await run(stream).tick(1000);

  t.deepEqual([1, 1, 1, 1, 1], result.events);
});

test('piece of time', async t => {
  const timeWindow = (offset, duration) => most
    .of().delay(offset)
    .constant(most.of().delay(duration));

  // source:         1----2----3----4----5----6-|
  // time:           0---050--100--150--200--250|
  // window(start):  ---------------s|
  // window(end):    -------------------------e|
  // result:         ---------------4----5|

  const source = most
    .iterate(x => x + 1, 1)
    .take(6)
    .zip(identity, most.periodic(50));

  const piece = timeWindow(150, 100);
  const stream = source.during(piece);
  const result = await run(stream).tick(450);

  t.deepEqual([4, 5], result.events);
});

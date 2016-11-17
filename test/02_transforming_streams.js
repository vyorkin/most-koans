import test from 'ava';
import * as most from 'most';
import { run } from 'most-test';

const __ = 'Fill in the blank';

test('the map transformation relates a stream to another', async t => {
  let result = '';
  await most.from(['wE', 'hOpE', 'yOU', 'aRe', 'eNJoyIng', 'tHiS'])
    .map(x => x.toLowerCase())
    .observe(x => { result += `${x} `; });

  t.is(__, result);
});

test('you can create a new stream by replacing each event with a constant', async t => {
  const results = [];
  await most.from([1, 2, 3])
    .constant(6)
    .forEach(x => { results.push(x); });

  t.deepEqual(__, results);
});

test('scan emits incremental results', async t => {
  const results = [];
  await most.from(['a', 'b', 'c'])
    .scan((acc, letter) => acc + letter, '')
    .observe(x => { results.push(x); });

  t.deepEqual(__, results);
});

test('chain maps each event into a stream and then merges these streams', async t => {
  // stream:     1-2-3|
  // f(1):       1|
  // f(2):       1--2|
  // f(3):       1--2--3|
  // flatMap(f): 1-1-1--2-2--3|

  const results = [];
  await most.from([1, 2, 3])
    .chain(x => most.iterate(v => v + 1, 1).take(x)) // alias: flatMap
    .observe(x => { results.push(x); });

  t.deepEqual(__, results);
});

test('the beginning may end, and the ending begin', async t => {
  const results = [];
  await most.from(['a', 'b', 'c'])
    .continueWith(() => most.iterate(x => x + 1, 1).take(3))
    .observe(x => { results.push(x); });

  t.deepEqual(__, results);
});

test('you can concatenate streams using concatMap', async t => {
  // stream:       1-2-3|
  // f(1):         1|
  // f(2):         1--2|
  // f(3):         1--2--3|
  // concatMap(f): 1--1-2--1-2-3|

  const results = [];
  await most.from([1, 2, 3])
    .concatMap(x => most.iterate(v => v + 1, 1).take(x))
    .observe(x => { results.push(x); });

  t.deepEqual(__, results);
});

test('use ap to apply the latest function to the latest value', async t => {
  let result = 0;
  const functions = [
    x => x + 1,
    x => x * x,
  ];

  await most.from(functions)
    .ap(most.from([1, 2, 3, 4]))
    .observe(x => { result += x; });

  t.is(__, result);
});

test('you can add timestamps, if you want to', async t => {
  const stream = most.of(1).delay(1).timestamp();

  const result = await run(stream).tick(/* advance by 1ms */);
  const { time, value } = result.events[0];

  t.is(__, !!time);
  t.is(__, !!value);
});

test('every next timestamp is greater than previous', async t => {
  const result = await most.periodic(10)
    .take(3)
    .constant(1)
    .timestamp()
    .map(o => o.time)
    .reduce((prev, curr) => curr > prev);

  t.is(__, result);
});

test('or just perform any side-effect', async t => {
  const results = [];
  const effects = [];

  await most.from([1, 2, 3])
    .tap(x => { effects.push(x + 1); })
    .observe(x => { results.push(x); });

  t.deepEqual(__, results);
  t.deepEqual(__, effects);
});

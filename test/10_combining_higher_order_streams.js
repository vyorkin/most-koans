import test from 'ava';
import * as most from 'most';
import { run } from 'most-test';

const __ = 'Fill in the blank';

test('you can join streams', async t => {
  // t: -0--1--2--3--4--5--6--7--8--9-->
  // s: -2--3|
  // 2:       -2-----2-----2-----2----->
  // 3:          -3--------3--------3-->
  // r:       -2--3--2-----3-----2--3-->
  //          |------------------|
  //                tick(6)

  const source = most.from([2, 3])
    .map(x => most.periodic(x, x).delay(x));

  const stream = source.join();
  const result = await run(stream).tick(6);

  t.deepEqual([2, 3, 2, 3, 2], result.events);
});

// older streams do not merge, latest stream win
test('or switch to latest', async t => {
  // t: -0--1--2--3--4--5--6--7--8--9--10->
  // s: -2--5|
  // 2:       -2-----2-----2-----2-------->
  // 3:                -5--------------5-->
  // r:       ----------5--------------5-->
  //          |------------------------|
  //                   tick(10)

  const source = most.from([2, 5])
    .map(x => most.periodic(x, x).delay(x));

  const stream = source.switch();
  const result = await run(stream).tick(10);

  t.deepEqual([5, 5], result.events);
});

test('or merge only up to the specified concurrency', async t => {
  // t: -0--1--2--3--4--5--6--7--8--9--10-11-->
  // s: -2--3--4--5|
  // 2:       -2-----2|
  // 3:          -3--------3|
  // 4:             -4-----------4|
  // 5:                -5--------------5|
  // r:       -2--3--2-----3-----4-----5|
  //          |---------------------------|
  //                     tick(12)

  const source = most.from([2, 3, 4, 5])
    .map(x => most.periodic(x, x).delay(x).take(2));

  const stream = source.mergeConcurrently(2);
  const result = await run(stream).tick(11);

  t.deepEqual([2, 3, 2, 3, 4, 5], result.events);
});

// TODO: add an example of pauseable and buffered pauseable streams

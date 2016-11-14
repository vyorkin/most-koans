import test from 'ava';
import * as most from 'most';
import { run } from 'most-test';

const __ = 'Fill in the blank';

const average = values => values.reduce((sum, x) => sum + x, 0) / values.length;

test('loop is kind of a contrary of scan', async t => {
  const source = most.iterate(x => x + 1, 0);

  // source:      --0----------1----------2----------3----- - -
  // values:      -[ ]--------[0]-------[0,1]-----[0,1,2]-- - -
  // x:           --0----------1----------2----------3----- - -
  // set:         -[0]-------[0,1]-----[0,1,2]---[0,1,2,3]- - -
  // result(avg): --0---------0.5---------1---------1.5---- - -

  const stream = source.loop((values, x) => {
    const set = [...values, x].slice(-10);
    const avg = average(set);
    return {
      seed: set,
      value: avg,
    };
  }, []).take(4);

  const result = await run(stream).tick();

  t.deepEqual([0, 0.5, 1, 1.5], result.events);
});

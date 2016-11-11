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

import test from 'ava';

const someAsyncFunction = () => new Promise(
  resolve => setTimeout(resolve, 100)
);

test('just playing ba with ava', async t => {
  const bar = await Promise.resolve('bar');
  t.is(await bar, 'bar');
});

test(t => {
  t.plan(1);

  return Promise
    .resolve(42)
    .then(value => t.is(42, value));
});

test.cb(t => {
  t.plan(1);

  someAsyncFunction().then(() => {
    t.pass();
    t.end();
  });
});

test.skip('I should fail', t => {
  t.plan(2);

  for (let i = 0; i < 3; i++) {
    t.true(i < 3);
  }
});

test.failing('I should fail as well', t => {
  plan(1);

  someAsyncFunction().then(() => t.pass());
});

test.todo('do something dude');

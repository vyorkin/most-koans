make a koan demonstrating the difference between these 2:

1)
```
const source = most.from(numbers)
  .zip(identity, most.periodic(50));
```

2)
```
const source = most.from(numbers)
  .concatMap(x => most.of(x).delay(50));
```

```
test('title', async t => {
  await most.from([1, 2, 3])
    .concatMap(x => most.of(x).delay(1000))
    .tap(console.log)
    .drain();
});
```

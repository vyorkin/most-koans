# Most.js Koans
# 公案

The [Most.js](https://github.com/cujojs/most) Koans are a fun and easy way to
get started with this awesome reactive programming toolkit. No experience assumed or
required. Just follow the instructions below to start making tests pass!

### Getting Started

The koans are broken out into chapters by file, transformations are covered in
`02_transforming_streams.js`, higher order streams is introduced in `10_combining_higher_order_streams.js`, etc.

### Installing

In order to run the koans you need [Node.js](https://nodejs.org/) installed. If
you do not already have Node set up, please [visit the website](https://nodejs.org/) to install Node.js.

To verify your installation, in your terminal window simply type:
```bash
$ node --version
```

### The Path to Enlightement

You can run the tests by calling `npm test` at your terminal window.
```bash
~/projects/github/most-koans $ npm test
```

For now, you have to update `"test": "ava --watch test/00_creating_streams.js"` in `packge.json`
and restart a test runner with `npm test` when you ready to move to the next chapter.

### Red, Green, Refactor

In test-driven development (TDD) the mantra has always been red: write a failing test and run it,
green: make the test pass, and refactor: look at the code and see if you can make it any better.

With the koans, you will need to run the tests and see it fail (red),
make the test pass (green), then take a moment and reflect upon the test
to see what it is teaching you and improve the code to better communicate its intent (refactor).

### Contributing

Patches are encouraged!
Just add whatever the fuck you want to.

### Credits

The main idea is taken from the
[clojure-koans](https://github.com/functional-koans/clojure-koans).

The project structure and many other things are borrowed from the
[RxJSKoans](https://github.com/Reactive-Extensions/RxJSKoans).

### License

[WTFPL](http://www.wtfpl.net/) – Do What the Fuck You Want to Public License.

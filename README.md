# Slayer [![Build Status](https://secure.travis-ci.org/bbc/slayer.png?branch=master)](http://travis-ci.org/bbc/slayer.js)

> JavaScript time series spike detection for Node.js; like the Octave [findpeaks](http://www.mathworks.co.uk/help/signal/ref/findpeaks.html) function.

Time series are often displayed as bar, line or area charts.
A _peak_ or _spike_ in a time series is a the highest value before the trend start to decrease.

In reality you do not need all the spikes. You only need **the highest spike amongst them**.
_Slayer_ helps to identify these local peaks easily.

[![](chart.png?raw=1)](http://blogs.sas.com/content/iml/2013/08/28/finite-diff-estimate-maxi/)

# Install

<table>
  <thead>
    <tr>
      <th>npm</th>
      <th>bower</th>
      <th>old school</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>npm install --save slayer</code></td>
      <td>-</td>
      <td><a href="https://github.com/bbc/slayer/archive/master.zip">download zip file</a></td>
    </tr>
  </tbody>
</table>

# Usage

_Slayer_ exposes a fluent JavaScript API and requires as little configuration as possible.
The following examples illustrates common use cases.

## Flat array peak detection

```js
var slayer = require('slayer');
var arrayData = [0, 0, 0, 12, 0, …];

slayer().fromArray(arrayData).then(spikes => {
  console.log(spikes);      // [ { x: 4, y: 12 }, { x: 12, y: 25 } ]
});
```

## Object based peak detection

```js
var slayer = require('slayer');
var arrayData = […, { date: '…', value: 12 }, …];

slayer()
  .y(item => item.value)
  .fromArray(arrayData)
  .then(spikes => {
    console.log(spikes);    // [ { x: 4, y: 12 }, { x: 12, y: 25 } ]
  });
```

## Streaming detection

```js
someStream
  .pipe(slayer().createReadStream())
  .on('error', err => console.error(err))
  .on('data', spike => {
    console.log(spike);      // { x: 4, y: 12 }
  });
```


# API

Access the _Slayer_ API by requiring the CommonJS module:

```js
var slayer = require('slayer');
```

A _spike_ object is an object composed of two keys:

- `x`: the index value within the time series array;
- `y`: the spike value within the time series array.

## `slayer(config)`

The `slayer()` factory returns a new chainable instance of _Slayer_.

The optional `config` object enables you to adjust its behaviour according to your needs:

- `minPeakDistance` (_Integer_): size of the values overlooked window. _Default is `30`_;
- `minPeakHeight` (_Number_): discard any value below that threshold. _Default is `0`_.

Returns a `slayer` chainable object.

## `.y(fn)`

Data accessor applied to each series item and used to determine spike values.

It will return this value as the `y` value of a spike object.

```js
slayer()
  .y(item => item.value)   // considering item looks like `{ value: 12 }`
  .fromArray(arrayData)
  .then(spikes => {
    console.log(spikes);   // { x: 4, y: 12 }
  });
```

Returns a mutated `slayer` chainable object.

## `.x(fn)`

Index accessor applied to each series item.

It will return this value as the `x` value of a spike object.

```js
slayer()
  .x((item, i) => item.date)  // considering item looks like `{ date: '2014-04-12T17:31:40.000Z', value: 12 }`
  .fromArray(arrayData)
  .then(spikes => {
    console.log(spikes);      // { x: '2014-04-12T17:31:40.000Z', y: 12 }
  });
```

Returns a mutated `slayer` chainable object.

## `.transform(fn)`

Transforms the spike object before returning it as part of the found spike collections.

It is useful if you want to add extra data to the returned spike object.

```js
slayer()
  .transform((xyItem, originalItem, i) => {
    xyItem.id = originalItem.id;

    return xyItem;
  })
  .fromArray(arrayData)
  .then(spikes => {
    console.log(spikes);   // { x: 4, y: 12, id: '21232f297a57a5a743894a0e4a801fc3' }
  });
```

Returns a mutated `slayer` chainable object.

## `.fromArray(data)`

Processes a finite array of data and returns them at once.

```js
slayer()
  .fromArray(arrayData)
  .then(spikes => {

    console.log(spikes);   // { x: 4, y: 12, id: '21232f297a57a5a743894a0e4a801fc3' }
  });
```

Returns an [ES2015 `Promise` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## `.createReadStream(options)`

Processes a stream of data and emits a `data` event each time a spike is found.
Although you might notice a slight delay as *spike deduplication* happens under the hood.

You can optionally pass an `options` object to tweak and adjust the precision of the analysis:

- `bufferingFactor` (_Number_): buffer ratio of the sliding window, against `minPeakDistance`. _Default is `4`_;
- `lookAheadFactor` (_Number_): additional buffer ratio to look ahead, against the sliding window size. _Default is `0.33`_.

With this setup, `slayer` will buffer *4 times* the amount of `minPeakDistance` with an additional *0.33 times* before performing an analysis before moving from *4 times* the amount of `minPeakDistance`.

The following example demonstrates the streaming analysis of a file containing single values on each row of the document:

```js
var split = require('split');

fs.createReadStream('./big-big-data.txt')
  .pipe(split())
  .pipe(slayer().createReadStream())
  .on('data', spike => console.log(spike));
```

Returns a [`ReadableStream`](https://nodejs.org/api/stream.html#stream_class_stream_readable).

# Contributing and testing

If you wish to contribute the project with code but you fear to break something, no worries as [TravisCI](https://travis-ci.org/bbc/slayer)
takes care of this for each Pull Request.

Nobody will blame your code. And feel free to ask _before_ making a pull request.
We will try to provide you guidance for code design etc.

If you want to run the tests locally, simply run:

```bash
npm test
```

If you want to run them continuously, then run:

```bash
npm test -- --watch
```

# Licence

> Copyright 2016 British Broadcasting Corporation
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

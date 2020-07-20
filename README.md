JavaScript implementation of Philip J. Schneider's "Algorithm for Automatically Fitting Digitized Curves" from the book "Graphics Gems".
Converted from Python implementation.

Fit one or more cubic Bezier curves to a polyline. Works with 2D and 3D curves (and should work for higher dimensions too).

This is a JS implementation of Philip J. Schneider's C code. The original C code is available on http://graphicsgems.org/ as well as in https://github.com/erich666/GraphicsGems

## Install

```
npm install --save @odiak/fit-curve
```

## Usage

```javascript
import { fitCurve } from '@odiak/fit-curve'
const points = [
  { x: 0, y: 0 },
  { x: 10, y: 10 },
  { x: 10, y: 0 },
  { x: 20, y: 0 }
]
const error = 50 // The smaller the number - the much closer spline should be

const bezierCurves = fitCurve(points, error)
// bezierCurves[0] === [ { x: 0, y: 0 }, { x: 20.27317402, y: 20.27317402 }, { x: -1.24665147, y: 0 }, { x: 20, y: 0 } ]
// where each element is {x, y} and elements are [first-point, control-point-1, control-point-2, second-point]
```

## Changelog

### 0.2.0

- Expose fitCubic, createTangent & add TypeScript declaration

### 0.1.7

- Bug fix #24.

### 0.1.6

- Bug fix #13. Use compiled (ES2015) version as main entry point.

## Development

`npm install` - builds transpiled and minified versions into `/lib`

`npm test` - runs tests

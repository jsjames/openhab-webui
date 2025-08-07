'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.breakpointValue = void 0
var breakpointValue = function (breakpoint, windowWidth) {
  var _a
  if (typeof breakpoint === 'number' || typeof breakpoint === 'string') {
    return Number(breakpoint)
  }
  else if (typeof breakpoint !== 'object') {
    return 0
  }
  var matchedBreakpoint = Infinity
  var matchedValue = (_a = breakpoint.default) !== null && _a !== void 0 ? _a : 0
  for (var k in breakpoint) {
    var bp = parseInt(k)
    var bpValRaw = breakpoint[k]
    var bpVal = parseInt(String(bpValRaw))
    if (isNaN(bp) || isNaN(bpVal))
      continue
    var isNewBreakpoint = windowWidth <= bp && bp <= matchedBreakpoint
    if (isNewBreakpoint) {
      matchedBreakpoint = bp
      matchedValue = bpValRaw
    }
  }
  return matchedValue
}
exports.breakpointValue = breakpointValue

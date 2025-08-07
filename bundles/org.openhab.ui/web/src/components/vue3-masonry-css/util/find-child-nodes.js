'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.findChildNodesWithClassName = findChildNodesWithClassName
// recursive function to find VNodes with the class 'item'
function findChildNodesWithClassName(nodes, className) {
  var result = []
  nodes.forEach(function (node) {
    var _a, _b, _c
    // check if the current node has the class 'item'
    var hasItemClass = (_b = (_a = node.props) === null || _a === void 0 ? void 0 : _a.class) === null || _b === void 0 ? void 0 : _b.includes(className)
    if (hasItemClass) {
      result.push(node)
    }
    // If the node has children and they are an array, recursively check them
    if (Array.isArray(node.children)) {
      result = result.concat(findChildNodesWithClassName(node.children, className))
    }
    // If the node's children are a render function, invoke the function and check the result
    else if (typeof node.children === 'object' && typeof ((_c = node.children) === null || _c === void 0 ? void 0 : _c.default) === 'function') {
      var childNodes = node.children.default() // Call the render function to get VNodes
      result = result.concat(findChildNodesWithClassName(childNodes, className))
    }
    // In some cases, children could be a single VNode or other structures
    else if (node.children && typeof node.children === 'object') {
      result = result.concat(findChildNodesWithClassName([node.children], className))
    }
  })
  return result
}

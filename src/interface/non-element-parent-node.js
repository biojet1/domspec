"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.NonElementParentNode = void 0;
var node_js_1 = require("./node.js");
var parent_node_js_1 = require("./parent-node.js");
var NonElementParentNode = /** @class */ (function (_super) {
    __extends(NonElementParentNode, _super);
    function NonElementParentNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NonElementParentNode.prototype.getElementById = function (id) {
        var _a = this, _b = node_js_1.NEXT, next = _a[_b], _c = node_js_1.END, end = _a[_c];
        while (next && next !== end) {
            if (next instanceof parent_node_js_1.ParentNode) {
            }
            // if (next.nodeType === 1) {
            // 	const el = next as Element;
            // 	if (el.id === id) {
            // 		return next;
            // 	}
            // }
            next = next[node_js_1.NEXT];
        }
        return null;
    };
    return NonElementParentNode;
}(parent_node_js_1.ParentNode));
exports.NonElementParentNode = NonElementParentNode;
// import { ChildNode } from "./child-node.js";
// import { Element } from "./element.js";

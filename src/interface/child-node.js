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
exports.ChildNode = void 0;
var node_js_1 = require("./node.js");
var ChildNode = /** @class */ (function (_super) {
    __extends(ChildNode, _super);
    function ChildNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ChildNode.prototype, "nextSibling", {
        //// Tree
        //// Dom
        get: function () {
            var node = this.precedingSibling;
            return node instanceof ChildNode ? node : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChildNode.prototype, "parentElement", {
        get: function () {
            var node = this.parentNode;
            return node instanceof element_js_1.Element ? node : null;
        },
        enumerable: false,
        configurable: true
    });
    return ChildNode;
}(node_js_1.Node));
exports.ChildNode = ChildNode;
var element_js_1 = require("./element.js");

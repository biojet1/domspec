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
exports.DocumentFragment = void 0;
var non_element_parent_node_js_1 = require("./non-element-parent-node.js");
var DocumentFragment = /** @class */ (function (_super) {
    __extends(DocumentFragment, _super);
    function DocumentFragment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DocumentFragment.prototype, "nodeType", {
        // https://dom.spec.whatwg.org/#documentfragment
        get: function () {
            return 11;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DocumentFragment.prototype, "nodeName", {
        get: function () {
            return "#document-fragment";
        },
        enumerable: false,
        configurable: true
    });
    return DocumentFragment;
}(non_element_parent_node_js_1.NonElementParentNode));
exports.DocumentFragment = DocumentFragment;

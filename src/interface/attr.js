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
exports.Attr = void 0;
var Attr = /** @class */ (function (_super) {
    __extends(Attr, _super);
    function Attr() {
        var _this = _super.call(this) || this;
        _this.name = _this.value = _this.localName = "";
        return _this;
    }
    Object.defineProperty(Attr.prototype, "textContent", {
        get: function () {
            // https://dom.spec.whatwg.org/#dom-node-textcontent
            return this.value;
        },
        set: function (value) {
            this.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attr.prototype, "nodeType", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attr.prototype, "nodeValue", {
        get: function () {
            // https://dom.spec.whatwg.org/#dom-node-nodevalue
            return this.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attr.prototype, "specified", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attr.prototype, "nodeName", {
        get: function () {
            return this.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attr.prototype, "ownerElement", {
        get: function () {
            var node = this.parentNode;
            return node || null;
        },
        enumerable: false,
        configurable: true
    });
    // isDefaultNamespace(namespaceURI?: string) {
    // 	const { ownerElement } = this;
    // 	return ownerElement && ownerElement.isDefaultNamespace(namespaceURI);
    // }
    // lookupNamespaceURI(prefix?: string) {
    // 	const { ownerElement } = this;
    // 	return ownerElement && ownerElement.lookupNamespaceURI(prefix);
    // }
    // lookupPrefix(namespaceURI: string) {
    // 	const { ownerElement } = this;
    // 	return ownerElement && ownerElement.lookupNamespacePrefix(prefix);
    // }
    Attr.prototype.lookupNamespaceURI = function (prefix) {
        var node = this.ownerElement;
        return node ? node.lookupNamespaceURI(prefix) : null;
    };
    return Attr;
}(node_js_1.Node));
exports.Attr = Attr;
var node_js_1 = require("./node.js");

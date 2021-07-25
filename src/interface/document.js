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
exports.Document = void 0;
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(contentType) {
        var _this = _super.call(this) || this;
        _this.contentType =
            contentType && contentType !== "" ? contentType : "application/xml";
        return _this;
    }
    Object.defineProperty(Document.prototype, "nodeType", {
        get: function () {
            return 9;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "nodeName", {
        get: function () {
            return "#document";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "documentElement", {
        get: function () {
            return this.firstElementChild;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "implementation", {
        get: function () {
            return new dom_implementation_js_1.DOMImplementation();
        },
        enumerable: false,
        configurable: true
    });
    Document.prototype.lookupNamespaceURI = function (prefix) {
        var node = this.documentElement;
        return node && node.lookupNamespaceURI(prefix);
    };
    Document.prototype.createElement = function (localName) {
        var node = new element_js_1.Element();
        node.localName = node.tagName = localName;
        node.ownerDocument = this;
        return node;
    };
    Document.prototype.createElementNS = function (ns, qualifiedName) {
        var _a = validateAndExtract(ns, qualifiedName), namespace = _a[0], prefix = _a[1], localName = _a[2];
        var node = new element_js_1.Element();
        if (localName) {
            node.localName = localName;
            if (prefix) {
                node.tagName = prefix + ":" + localName;
            }
            else {
                node.tagName = localName;
            }
            if (namespace)
                node.namespaceURI = namespace;
        }
        else {
            // TODO: error
        }
        node.ownerDocument = this;
        return node;
    };
    Document.prototype.createTextNode = function (text) {
        var node = new character_data_js_1.Text(text);
        node.ownerDocument = this;
        return node;
    };
    Document.prototype.createComment = function (text) {
        var node = new character_data_js_1.Comment(text);
        node.ownerDocument = this;
        return node;
    };
    Document.prototype.createCDATASection = function (text) {
        var node = new character_data_js_1.CDATASection(text);
        node.ownerDocument = this;
        return node;
    };
    return Document;
}(non_element_parent_node_js_1.NonElementParentNode));
exports.Document = Document;
function validateAndExtract(namespace, qualifiedName) {
    var prefix = null, localName = qualifiedName, pos = qualifiedName.indexOf(":");
    var ns = namespace === "" || !namespace ? null : namespace;
    if (pos >= 0) {
        prefix = qualifiedName.substring(0, pos);
        localName = qualifiedName.substring(pos + 1);
    }
    if ((prefix !== null && ns === null) ||
        (prefix === "xml" && ns !== namespace_js_1.XML) ||
        ((prefix === "xmlns" || qualifiedName === "xmlns") && ns !== namespace_js_1.XMLNS) ||
        (ns === namespace_js_1.XMLNS && !(prefix === "xmlns" || qualifiedName === "xmlns"))) {
        throw new Error("NamespaceError");
    }
    return [ns, prefix, localName];
}
// exports.NAMESPACE = {
//   HTML: 'http://www.w3.org/1999/xhtml',
//   XML: 'http://www.w3.org/XML/1998/namespace',
//   XMLNS: 'http://www.w3.org/2000/xmlns/',
//   MATHML: 'http://www.w3.org/1998/Math/MathML',
//   SVG: 'http://www.w3.org/2000/svg',
//   XLINK: 'http://www.w3.org/1999/xlink'
// };
var namespace_js_1 = require("./namespace.js");
// import { Node } from "./node.js"; // prevent circular import
// import { ChildNode } from "./child-node.js"; // prevent circular import
var non_element_parent_node_js_1 = require("./non-element-parent-node.js");
var element_js_1 = require("./element.js");
var character_data_js_1 = require("./character-data.js");
var dom_implementation_js_1 = require("./dom-implementation.js");

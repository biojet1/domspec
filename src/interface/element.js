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
exports.Element = void 0;
var node_js_1 = require("./node.js");
var parent_node_js_1 = require("./parent-node.js");
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element() {
        var _this = _super.call(this) || this;
        _this.localName = _this.tagName = "";
        return _this;
    }
    Object.defineProperty(Element.prototype, "nodeType", {
        get: function () {
            return 1; // ELEMENT_NODE (1)
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "nodeName", {
        get: function () {
            return this.tagName;
        },
        enumerable: false,
        configurable: true
    });
    Element.prototype.getAttributeNode = function (name) {
        for (var attr = this[node_js_1.NEXT]; attr && attr instanceof attr_js_1.Attr; attr = attr[node_js_1.NEXT]) {
            if (!attr.namespaceURI && attr.name === name)
                return attr;
        }
        return null;
    };
    Element.prototype.getAttributeNodeNS = function (namespace, localName) {
        for (var attr = this[node_js_1.NEXT]; attr && attr instanceof attr_js_1.Attr; attr = attr[node_js_1.NEXT]) {
            if (attr.namespaceURI === namespace) {
                if (attr.localName === localName) {
                    return attr;
                }
            }
        }
        return null;
    };
    Element.prototype.lookupNamespaceURI = function (prefix) {
        if (prefix === "" || !prefix)
            prefix = null;
        var namespaceURI = this.namespaceURI;
        if (namespaceURI && this.prefix === prefix)
            return namespaceURI;
        for (var attr = this[node_js_1.NEXT]; attr && attr instanceof attr_js_1.Attr; attr = attr[node_js_1.NEXT]) {
            if (attr.namespaceURI === namespace_js_1.XMLNS) {
                var prefixA = attr.prefix, localNameA = attr.localName;
                if ((prefixA === "xmlns" && localNameA === prefix) ||
                    (!prefix && !prefixA && localNameA === "xmlns")) {
                    return attr.value || null;
                }
            }
        }
        var parent = this.parentElement;
        return parent ? parent.lookupNamespaceURI(prefix) : null;
    };
    Element.prototype.setAttribute = function (qname, value) {
        var attr = this[node_js_1.NEXT];
        for (; attr && attr instanceof attr_js_1.Attr; attr = attr[node_js_1.NEXT]) {
            var namespaceURI = attr.namespaceURI, name_1 = attr.name;
            if (!namespaceURI && qname === name_1) {
                attr.value = value;
                return;
            }
        }
        if (!attr || !(attr instanceof attr_js_1.Attr)) {
            attr = this;
        }
        var node = new attr_js_1.Attr();
        node.name = qname;
        node.localName = qname;
        node.value = value;
        node.parentNode = this;
        attr.insertRight(node);
    };
    Element.prototype.setAttributeNS = function (ns, qname, value) {
        var prefix, lname;
        if (ns === "" || !ns) {
            return this.setAttribute(qname, value);
        }
        else {
            var pos = qname.indexOf(":");
            if (pos < 0) {
                prefix = null;
                lname = qname;
            }
            else {
                prefix = qname.substring(0, pos);
                lname = qname.substring(pos + 1);
            }
            if (prefix === "" || !prefix)
                prefix = null;
        }
        var attr = this[node_js_1.NEXT];
        for (; attr && attr instanceof attr_js_1.Attr; attr = attr[node_js_1.NEXT]) {
            var namespaceURI = attr.namespaceURI, localName = attr.localName;
            if (namespaceURI === ns && localName === qname) {
                attr.value = value;
                return;
            }
        }
        if (!attr || !(attr instanceof attr_js_1.Attr)) {
            attr = this;
        }
        var node = new attr_js_1.Attr();
        node.name = qname;
        node.localName = lname;
        node.value = value;
        node.parentNode = this;
        node.namespaceURI = ns;
        if (prefix)
            node.prefix = prefix;
        attr.insertRight(node);
    };
    return Element;
}(parent_node_js_1.ParentNode));
exports.Element = Element;
var namespace_js_1 = require("./namespace.js");
var attr_js_1 = require("./attr.js");

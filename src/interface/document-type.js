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
exports.DocumentType = void 0;
var child_node_js_1 = require("./child-node.js");
var DocumentType = /** @class */ (function (_super) {
    __extends(DocumentType, _super);
    function DocumentType(name, publicId, systemId) {
        if (publicId === void 0) { publicId = ""; }
        if (systemId === void 0) { systemId = ""; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.publicId = publicId || "";
        _this.systemId = systemId || "";
        return _this;
    }
    Object.defineProperty(DocumentType.prototype, "nodeType", {
        get: function () {
            return 10;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DocumentType.prototype, "nodeName", {
        get: function () {
            return this.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DocumentType.prototype, "nodeLength", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    return DocumentType;
}(child_node_js_1.ChildNode));
exports.DocumentType = DocumentType;

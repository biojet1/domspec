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
exports.HTMLDocument = void 0;
var HTMLDocument = /** @class */ (function (_super) {
    __extends(HTMLDocument, _super);
    function HTMLDocument() {
        return _super.call(this, 'text/html') || this;
        // this.namespaceURI = HTML;
    }
    return HTMLDocument;
}(document_js_1.Document));
exports.HTMLDocument = HTMLDocument;
var document_js_1 = require("../document.js");
// import { HTML } from "../namespace.js";

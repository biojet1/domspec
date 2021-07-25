"use strict";
exports.__esModule = true;
exports.DOMImplementation = void 0;
var DOMImplementation = /** @class */ (function () {
    function DOMImplementation() {
    }
    DOMImplementation.prototype.hasFeature = function (feature, version) {
        if (version === void 0) { version = ""; }
        switch (feature) {
            case "xml":
                switch (version) {
                    case "":
                    case "1.0":
                    case "2.0":
                        return true;
                }
                break;
            case "core":
                switch (version) {
                    case "":
                    case "2.0":
                        return true;
                }
                break;
            case "html":
                switch (version) {
                    case "":
                    case "1.0":
                    case "2.0":
                        return true;
                }
                break;
            case "xhtml":
                switch (version) {
                    case "":
                    case "1.0":
                    case "2.0":
                        return true;
                }
                break;
        }
        return false;
    };
    DOMImplementation.prototype.createDocumentType = function (qualifiedName, publicId, systemId) {
        return new document_type_js_1.DocumentType(qualifiedName, publicId, systemId);
    };
    DOMImplementation.prototype.createDocument = function (namespace, qualifiedName, doctype) {
        var doc = new document_js_2.Document(namespace);
        if (doctype) {
            if (doctype.ownerDocument) {
                throw new Error("the object is in the wrong Document, a call to importNode is required");
            }
            doctype.ownerDocument = doc;
            doc.appendChild(doctype);
        }
        if (qualifiedName) {
            doc.appendChild(doc.createElementNS(namespace || null, qualifiedName));
        }
        return doc;
    };
    DOMImplementation.prototype.createHTMLDocument = function (titleText) {
        if (titleText === void 0) { titleText = ""; }
        var d = new document_js_1.HTMLDocument();
        var root = d.createElement("html");
        var head = d.createElement("head");
        var title = d.createElement("title");
        title.appendChild(d.createTextNode(titleText));
        head.appendChild(title);
        root.appendChild(head);
        root.appendChild(d.createElement("body"));
        d.appendChild(root);
        return d;
    };
    return DOMImplementation;
}());
exports.DOMImplementation = DOMImplementation;
var document_js_1 = require("./html/document.js");
var document_js_2 = require("./document.js");
var document_type_js_1 = require("./document-type.js");

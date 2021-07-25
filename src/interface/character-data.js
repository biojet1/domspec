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
exports.CDATASection = exports.Text = exports.Comment = exports.CharacterData = void 0;
var child_node_js_1 = require("./child-node.js");
var CharacterData = /** @class */ (function (_super) {
    __extends(CharacterData, _super);
    function CharacterData(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
    }
    Object.defineProperty(CharacterData.prototype, "nodeValue", {
        get: function () {
            // https://dom.spec.whatwg.org/#dom-node-nodevalue
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CharacterData.prototype, "textContent", {
        get: function () {
            // https://dom.spec.whatwg.org/#dom-node-textcontent
            return this.data;
        },
        set: function (data) {
            this.data = data;
        },
        enumerable: false,
        configurable: true
    });
    CharacterData.prototype.appendData = function (data) {
        this.data += data;
    };
    CharacterData.prototype.deleteData = function (offset, count) {
        this.data =
            this.data.slice(0, offset) + this.data.slice(0, offset + count);
    };
    CharacterData.prototype.insertData = function (offset, data) {
        this.data = this.data.slice(0, offset) + data + this.data.slice(offset);
    };
    CharacterData.prototype.replaceData = function (offset, count, data) {
        this.deleteData(offset, count);
        this.insertData(offset, data);
    };
    CharacterData.prototype.substringData = function (offset, count) {
        this.data = this.data.substr(offset, count);
    };
    Object.defineProperty(CharacterData.prototype, "length", {
        get: function () {
            return this.data.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CharacterData.prototype, "nodeLength", {
        get: function () {
            return this.data.length;
        },
        enumerable: false,
        configurable: true
    });
    return CharacterData;
}(child_node_js_1.ChildNode));
exports.CharacterData = CharacterData;
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    function Comment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Comment.prototype, "nodeType", {
        //// Dom
        get: function () {
            return 8;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Comment.prototype, "nodeName", {
        get: function () {
            return "#comment";
        },
        enumerable: false,
        configurable: true
    });
    return Comment;
}(CharacterData));
exports.Comment = Comment;
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Text.prototype, "nodeType", {
        //// Dom
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "nodeName", {
        get: function () {
            return "#data";
        },
        enumerable: false,
        configurable: true
    });
    return Text;
}(CharacterData));
exports.Text = Text;
var CDATASection = /** @class */ (function (_super) {
    __extends(CDATASection, _super);
    function CDATASection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CDATASection;
}(Text));
exports.CDATASection = CDATASection;

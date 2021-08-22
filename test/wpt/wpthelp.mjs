// import { parseDOM, DOMParser } from "../../dist/dom-parse.js";
// import { Node } from "../../dist/node.js";
// import { Document } from "../../dist/document.js";
// import { Element } from "../../dist/element.js";
// import { HTMLCollection } from "../../dist/parent-node.js";
// import { Window } from "../../dist/window.js";
import tap from "tap";
import * as all from "../../dist/all.js";
// console.log("ALL", all);

for (const [k, v] of Object.entries(all)) {
  // console.log(k);
  global[k] = v;
}

// global.Node = Node;
// global.Document = Document;
// global.HTMLCollection = HTMLCollection;
// global.Element = Element;

const parser = new DOMParser();
global.loadDOM = function (xml, mime = "text/html") {
  const doc = (global.document = parser.parseFromString(xml, mime));
  global.window = new Window(doc);
  global.frames = global.window.frames;
  return doc;
};

let current_t = null;
global.test = function (fn, msg, opt={}) {
  tap.test(msg, opt, function (t) {
    current_t = t;
    const self = {
      add_cleanup: function (fn) {
        t.teardown(fn);
      },
    };

    fn.call(self);
    t.end();
  });
};

global.assert_throws_dom = function (what, fn) {
  if (/^[A-Z_]+$/.test(what)) {
    what = what
      .toLowerCase()
      .replace(/(_[a-z])/g, (m, p1) => p1.slice(1).toUpperCase())
      .replace(/^[a-z]/g, (m) => m.toUpperCase());
  }
  (current_t || tap).throws(fn, Error, { message: what }, what);
};

global.assert_equals = function (a, b, msg) {
  (current_t || tap).strictSame(a, b, msg);
};
global.assert_true = function (a, msg) {
  (current_t || tap).strictSame(a, true, msg);
};
global.assert_false = function (a, msg) {
  (current_t || tap).strictSame(a, false, msg);
};

global.assert_array_equals = function (a, b, msg) {
  const t = current_t || tap;
  t.strictSame(a.length, b.length, `len not eq: ${msg}`);
  let n = b.length;

  while (n-- > 0) {
    t.strictSame(a[n], b[n], ` ${n}: ${msg}`);
  }
};

global.assert_not_equals = function (actual, expected, description) {
  (current_t || tap).not(actual, expected, description);
};

// t.afterEach(fn(childTest))
//     this.add_cleanup(function() { document.body.removeChild(element) });

global.setup = function (fn) {
  if (typeof fn === "function") {
    fn();
  }
};

global.done = function () {};
global.assert_throws_js = function (constructor, func, description) {
  // assert_throws_js_impl(constructor, func, description, "assert_throws_js");

  (current_t || tap).throws(func, constructor, description, [
    constructor,
    "assert_throws_js",
  ]);
};

global.async_test = function (func, name, properties) {};

/*
 * Convert a value to a nice, human-readable string
 */
const replacements = {
  0: "0",
  1: "x01",
  2: "x02",
  3: "x03",
  4: "x04",
  5: "x05",
  6: "x06",
  7: "x07",
  8: "b",
  9: "t",
  10: "n",
  11: "v",
  12: "f",
  13: "r",
  14: "x0e",
  15: "x0f",
  16: "x10",
  17: "x11",
  18: "x12",
  19: "x13",
  20: "x14",
  21: "x15",
  22: "x16",
  23: "x17",
  24: "x18",
  25: "x19",
  26: "x1a",
  27: "x1b",
  28: "x1c",
  29: "x1d",
  30: "x1e",
  31: "x1f",
  "0xfffd": "ufffd",
  "0xfffe": "ufffe",
  "0xffff": "uffff",
};

global.format_value = function (val, seen) {
  if (!seen) {
    seen = [];
  }
  if (typeof val === "object" && val !== null) {
    if (seen.indexOf(val) >= 0) {
      return "[...]";
    }
    seen.push(val);
  }
  if (Array.isArray(val)) {
    let output = "[";
    if (val.beginEllipsis !== undefined) {
      output += "…, ";
    }
    output += val
      .map(function (x) {
        return format_value(x, seen);
      })
      .join(", ");
    if (val.endEllipsis !== undefined) {
      output += ", …";
    }
    return output + "]";
  }

  switch (typeof val) {
    case "string":
      val = val.replace(/\\/g, "\\\\");
      for (var p in replacements) {
        var replace = "\\" + replacements[p];
        val = val.replace(RegExp(String.fromCharCode(p), "g"), replace);
      }
      return '"' + val.replace(/"/g, '\\"') + '"';
    case "boolean":
    case "undefined":
      return String(val);
    case "number":
      // In JavaScript, -0 === 0 and String(-0) == "0", so we have to
      // special-case.
      if (val === -0 && 1 / val === -Infinity) {
        return "-0";
      }
      return String(val);
    case "object":
      if (val === null) {
        return "null";
      }

      // Special-case Node objects, since those come up a lot in my tests.  I
      // ignore namespaces.
      if (is_node(val)) {
        switch (val.nodeType) {
          case Node.ELEMENT_NODE:
            var ret = "<" + val.localName;
            for (var i = 0; i < val.attributes.length; i++) {
              ret +=
                " " +
                val.attributes[i].name +
                '="' +
                val.attributes[i].value +
                '"';
            }
            ret += ">" + val.innerHTML + "</" + val.localName + ">";
            return "Element node " + truncate(ret, 60);
          case Node.TEXT_NODE:
            return 'Text node "' + truncate(val.data, 60) + '"';
          case Node.PROCESSING_INSTRUCTION_NODE:
            return (
              "ProcessingInstruction node with target " +
              format_value(truncate(val.target, 60)) +
              " and data " +
              format_value(truncate(val.data, 60))
            );
          case Node.COMMENT_NODE:
            return "Comment node <!--" + truncate(val.data, 60) + "-->";
          case Node.DOCUMENT_NODE:
            return (
              "Document node with " +
              val.childNodes.length +
              (val.childNodes.length == 1 ? " child" : " children")
            );
          case Node.DOCUMENT_TYPE_NODE:
            return "DocumentType node";
          case Node.DOCUMENT_FRAGMENT_NODE:
            return (
              "DocumentFragment node with " +
              val.childNodes.length +
              (val.childNodes.length == 1 ? " child" : " children")
            );
          default:
            return "Node object of unknown type";
        }
      }

    /* falls through */
    default:
      try {
        return typeof val + ' "' + truncate(String(val), 1000) + '"';
      } catch (e) {
        return (
          "[stringifying object threw " +
          String(e) +
          " with type " +
          String(typeof e) +
          "]"
        );
      }
  }
};

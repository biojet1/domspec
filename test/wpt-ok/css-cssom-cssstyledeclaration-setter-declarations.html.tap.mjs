import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>CSSOM test: declaration block after setting via CSSOM</title>\n<link rel=\"help\" href=\"https://drafts.csswg.org/cssom/#set-a-css-declaration-value\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

  function generateCSSDeclBlock(props) {
    let elem = document.createElement("div");
    let cssText = props.map(({name, value, priority}) => {
      let longhand = `${name}: ${value}`;
      if (priority) {
        longhand += "!" + priority;
      }
      return longhand + ";";
    }).join(" ");
    elem.setAttribute("style", cssText);
    return elem.style;
  }
  function compareByName(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }
  function checkDeclarationsAnyOrder(block, props, msg) {
    let actual = [];
    for (let name of block) {
      let value = block.getPropertyValue(name);
      let priority = block.getPropertyPriority(name);
      actual.push({name, value, priority});
    }
    actual.sort(compareByName);
    let expected = Array.from(props);
    expected.sort(compareByName);
    assert_object_equals(actual, expected, "Declaration block content should match " + msg);
  }
  function longhand(name, value, priority="") {
    return {name, value, priority};
  }
  function* shorthand(name, value, priority="") {
    for (let subprop of SUBPROPS[name]) {
      yield longhand(subprop, value, priority);
    }
  }

  const SUBPROPS = {
    "margin": ["margin-top", "margin-right", "margin-bottom", "margin-left"],
    "padding": ["padding-top", "padding-right", "padding-bottom", "padding-left"],
  };

  test(function() {
    let expectedDecls = [
      longhand("top", "1px"),
      longhand("bottom", "2px"),
      longhand("left", "3px", "important"),
      longhand("right", "4px"),
    ];
    let block = generateCSSDeclBlock(expectedDecls);
    checkDeclarationsAnyOrder(block, expectedDecls, "in initial block");

    block.setProperty("top", "5px", "important");
    expectedDecls[0] = longhand("top", "5px", "important");
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting existing property");

    block.setProperty("bottom", "2px");
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting existing property with identical value");

    block.setProperty("left", "3px");
    expectedDecls[2].priority = "";
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting existing property with different priority");

    block.setProperty("float", "none");
    expectedDecls.push(longhand("float", "none"));
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting non-existing property");
  }, "setProperty with longhand should update only the declaration being set");

  test(function() {
    let expectedDecls = [
      longhand("top", "1px"),
      longhand("bottom", "2px"),
      longhand("left", "3px", "important"),
      longhand("right", "4px"),
    ];
    let block = generateCSSDeclBlock(expectedDecls);
    checkDeclarationsAnyOrder(block, expectedDecls, "in initial block");

    block.top = "5px";
    expectedDecls[0] = longhand("top", "5px");
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting existing property");

    block.bottom = "2px";
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting existing property with identical value");

    block.left = "3px";
    expectedDecls[2].priority = "";
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting existing property with different priority");

    block.float = "none";
    expectedDecls.push(longhand("float", "none"));
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting non-existing property");
  }, "property setter should update only the declaration being set");

  test(function() {
    let expectedDecls = [
      ...shorthand("margin", "1px"),
      longhand("top", "2px"),
      ...shorthand("padding", "3px", "important"),
    ];
    let block = generateCSSDeclBlock(expectedDecls);
    checkDeclarationsAnyOrder(block, expectedDecls, "in initial block");

    block.setProperty("margin", "4px");
    for (let i = 0; i < 4; i++) {
      expectedDecls[i].value = "4px";
    }
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting an existing shorthand");

    block.setProperty("margin", "4px");
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting an existing shorthand with identical value");

    block.setProperty("padding", "3px");
    for (let i = 5; i < 9; i++) {
      expectedDecls[i].priority = "";
    }
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting an existing shorthand with different priority");

    block.setProperty("margin-bottom", "5px", "important");
    expectedDecls[2] = longhand("margin-bottom", "5px", "important");
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting a longhand in an existing shorthand");
  }, "setProperty with shorthand should update only the declarations being set");

  test(function() {
    let expectedDecls = [
      ...shorthand("margin", "1px"),
      longhand("top", "2px"),
      ...shorthand("padding", "3px", "important"),
    ];
    let block = generateCSSDeclBlock(expectedDecls);
    checkDeclarationsAnyOrder(block, expectedDecls, "in initial block");

    block.margin = "4px";
    for (let i = 0; i < 4; i++) {
      expectedDecls[i].value = "4px";
    }
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting an existing shorthand");

    block.margin = "4px";
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting an existing shorthand with identical value");

    block.padding = "3px";
    for (let i = 5; i < 9; i++) {
      expectedDecls[i].priority = "";
    }
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting an existing shorthand with different priority");

    block.marginBottom = "5px";
    expectedDecls[2] = longhand("margin-bottom", "5px");
    checkDeclarationsAnyOrder(block, expectedDecls, "after setting a longhand in an existing shorthand");
  }, "longhand property setter should update only the decoarations being set");

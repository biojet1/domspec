import tap from 'tap';
import { DOMParser } from '../../dist/dom-parse.js';
const parser = new DOMParser();
// jsdom/test/to-port-to-wpts/level2/style.js
tap.test('level2/style', function (t) {
    const document = parser.parseFromString(
        `<html><head><style>p{color:red}</style></head><body>`,
        'text/html',
    );
    const style = document.head.lastChild;
    t.same(style.sheet.cssRules.length, 1);
    t.same(style.sheet.cssRules[0].selectorText, 'p');
    t.same(style.sheet.cssRules[0].style.color, 'red');

    t.end();
});

tap.test('getComputedStyleFromEmbeddedSheet1', function (t) {
    const document = parser.parseFromString(`
      <html><head><style>#id1 .clazz { margin-left: 100px; }</style></head><body>
      <div id="id1"><p class="clazz"></p></div>
      </body></html>`);
    const style = document.head.lastChild;
    var p = document.getElementsByTagName('p')[0];
    var cs = document.defaultView.getComputedStyle(p);
    t.same(cs.marginLeft, '100px', 'computed marginLeft of p[0] is 100px');

    t.end();
});

tap.test('getComputedStyleFromEmbeddedSheet2', function (t) {
    const document =
        parser.parseFromString(`<html><head><style>#id1 .clazz, #id2 .clazz { margin-left: 100px; }</style></head><body>
        <div id="id1"><p class="clazz"></p></div>
        <div id="id2"><p class="clazz"></p></div>
        </body></html>`);
    const window = document.defaultView;
    let p = window.document.getElementsByTagName('p')[0];
    let cs = window.getComputedStyle(p);
    t.equal(cs.marginLeft, '100px', 'computed marginLeft of p[0] is 100px');

    p = window.document.getElementsByTagName('p')[1];
    cs = window.getComputedStyle(p);
    t.equal(cs.marginLeft, '100px', 'computed marginLeft of p[1] is 100px');

    t.end();
});

tap.test('getComputedStyleFromEmbeddedSheet2', function (t) {
    const document =
        parser.parseFromString(`<html><head><style>#id1 .clazz, button[onclick="ga(this, event)"],
        #id2 .clazz { margin-left: 100px; }</style></head><body>
        <div id="id1"><p class="clazz"></p></div>
        <div id="id2"><p class="clazz"></p></div>
        <button onclick="ga(this, event)">analytics button</button>
        </body></html>`);
    const window = document.defaultView;
    let p = window.document.getElementsByTagName('p')[1];
    let cs = window.getComputedStyle(p);
    t.equal(cs.marginLeft, '100px', 'computed marginLeft of p[1] is 100px');

    var button = window.document.getElementsByTagName('button')[0];
    cs = window.getComputedStyle(button);
    t.equal(cs.marginLeft, '100px', 'computed marginLeft of button[0] is 100px');

    t.end();
});

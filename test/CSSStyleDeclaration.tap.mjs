import tap from 'tap';
import { CSSStyleDeclaration } from '../dist/all.js';

tap.test('margin padding', function (t) {
    const style = CSSStyleDeclaration.new();
    style.cssText = 'margin: 15px; padding: 2px;';
    t.equal(style.margin, '15px', 'margin');
    t.equal(style.padding, '2px', 'padding');
    t.end();
});

tap.test('Mutability', function (t) {
    const style = CSSStyleDeclaration.new();
    style.cssText = 'margin: 10px; padding: 0px;';

    t.equal(style.margin, '10px', 'margin');
    t.equal(style.padding, '0px', 'padding');

    style.padding = '5px';
    style.border = '1px solid';

console.log(style);

    t.equal(style.border, '1px solid', 'border');
    t.equal(style.padding, '5px', 'padding');

    t.end();
});

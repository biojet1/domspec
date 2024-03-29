import tap from 'tap';
import { CSSStyleDeclaration } from '../../dist/css/index.js';

tap.test('margin padding', function (t) {
    const style = CSSStyleDeclaration.new();
    style.cssText = 'margin: 15px; padding: 2px;';
    t.equal(style.margin, '15px', 'margin');
    t.equal(style.padding, '2px', 'padding');
    style.cssText = '';
    t.equal(style.cssText, '', 'cssText');
    t.end();
});

tap.test('Mutability', function (t) {
    const style = CSSStyleDeclaration.new();
    style.cssText = 'margin: 10px; padding: 0px;';

    t.equal(style.length, 2);
    t.equal(style.margin, '10px', 'margin');
    t.equal(style.padding, '0px', 'padding');

    style.padding = '5px';
    style.border = '1px solid';

    // console.log(style.self);
    // t.equal(style.length, 3);
    t.equal(style.border, '1px solid', 'border');
    t.equal(style.padding, '5px', 'padding');
    style.padding = '';
    // t.equal(style.length, 2);
    style.border = '';
    // t.equal(style.length, 1);
     style.margin = '';
    // t.equal(style.length, 0);


    t.end();
});

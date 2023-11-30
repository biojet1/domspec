'uses strict';
import test from 'tap';
import { DOMParser } from '../dist/all.js';

const CI = true;
const parser = new DOMParser();

test.test(`getBBox`, { bail: !CI }, function (t) {
    const { all } = parser.parseFromString(
        `<svg xmlns="http://www.w3.org/2000/svg">

  <title>Bounding Box Calculation</title>
  <desc>Examples of elements with different bounding box results based on context.</desc>

  <defs id="defs-1">
     <rect id="rect-1" x="20" y="20" width="40" height="40" fill="blue" />
  </defs>

  <g id="group-1">
    <use id="use-1" href="#rect-1" x="10" y="10" />

    <g id="group-2" display="none">
      <rect id="rect-2" x="10" y="10" width="100" height="100" fill="red" />
    </g>
  </g>
</svg>`,
        `application/xml`,
    );

    t.same(all['rect-1'].x.baseVal.value, 20, '.x.baseVal.value');
    t.same(all['rect-1'].getBBox().toArray(), [20, 20, 40, 40], 'rect-1');
    t.same(all['rect-2'].getBBox().toArray(), [10, 10, 100, 100], 'rect-2');
    t.same(all['group-2'].getBBox().toArray(), [10, 10, 100, 100], 'group-2');
    t.same(all['defs-1'].getBBox().toArray(), [0, 0, 0, 0], 'defs-1');
    t.same(all['use-1'].getBBox().toArray(), [30, 30, 40, 40], 'use-1');
    t.same(all['group-1'].getBBox().toArray(), [30, 30, 40, 40], 'group-1');
    t.same(all['use-1']._hrefElement.id, 'rect-1', 'use-1 <- rect-1');
    t.end();
});

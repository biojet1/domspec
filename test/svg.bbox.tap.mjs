"uses strict";
import test from "tap";
import { Document, SVGGraphicsElement, DOMParser, Box } from "../dist/all.js";
// import { DOMParser } from "../dist/dom-parse.js";

const CI = true;
const parser = new DOMParser();

test.test(`ParentNode`, { bail: !CI }, function (t) {
    const doc = parser.parseFromString(
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
        `application/xml`
    );

    const top = doc.documentElement;
    const use = doc.getElementById("use-1");

    // console.log(
    //     "href",
    //     use.getAttribute("href"),
    //     `href=${
    //         use.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
    //         use.getAttribute("href")
    //     }`
    // );
    let id =
        use.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
        use.getAttribute("href");
    console.log("id", use.refElement().id);
    // if (id) {
    //     id =
    //     console.log("id2", );

    //      use.ownerDocument.getElementById(id.substr(id.indexOf("#")));
    // }

    // console.log(
    //     "get",
    //     use.ownerDocument.getElementById("rect-1").id,
    //     use.refElement()
    // );

    // getBBox
    // let box = Box.new();
    // for(const e of   doc.getElementById("group-1").children){
    //     box = box.merge(e.getBBox())
    //     console.log("group-1 / ", e.id, e.getBBox().toArray(), e.canRender(), e instanceof SVGGraphicsElement, box);

    // }

    t.same(doc.getElementById("rect-1").getBBox().toArray(), [20, 20, 40, 40]);
    t.same(
        doc.getElementById("rect-2").getBBox().toArray(),
        [10, 10, 100, 100]
    );
    t.same(
        doc.getElementById("group-2").getBBox().toArray(),
        [10, 10, 100, 100],
        "group-2"
    );
    t.same(
        doc.getElementById("defs-1").getBBox().toArray(),
        [0, 0, 0, 0],
        "defs-1"
    );
    t.same(
        doc.getElementById("use-1").getBBox().toArray(),
        [30, 30, 40, 40],
        "use-1"
    );
    t.same(
        doc.getElementById("group-1").getBBox().toArray(),
        [30, 30, 40, 40],
        "group-1"
    );
    t.end();
});

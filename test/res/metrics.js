const root = document.documentElement;
root.id || (root.id = 'V0');

((a) => {
    window.geom_lines = a;
})(
    Array.from(root.querySelectorAll(`line[id]`)).map((v) => {
        const [x1, y1, x2, y2] = [v.x1.baseVal.value, v.y1.baseVal.value, v.x2.baseVal.value, v.y2.baseVal.value];
        v.setAttribute('geom', `${x1},${y1} ${x2},${y2}`);
        return [v.id, x1, y1, x2, y2];
    })
);

window.geom_rects = Array.from(root.querySelectorAll(`rect[id], svg[id]`))
    .concat(root)
    .map((v) => {
        const a = [v.x.baseVal.value, v.y.baseVal.value, v.width.baseVal.value, v.height.baseVal.value];
        v.setAttribute('geom', `${a[0]},${a[1]} ${a[2]}x${a[3]}`);
        return [v.id, ...a];
    });

window.geom_marus = Array.from(root.querySelectorAll(`circle`))
    .map((v) => {
        const r = v.getBoundingClientRect();
        const a = [v.r.baseVal.value, v.cx.baseVal.value, v.cy.baseVal.value];
        v.setAttribute('geom', `${a[0]} @ ${a[1]},${a[2]}`);
        return [v.id, ...a];
    })
    .filter((v) => v[0]);
window.boxes = Array.from(root.querySelectorAll(`*[id]`)).map((v) => {
    const r = v.getBoundingClientRect();
    v.setAttribute('bcr', `${r.x},${r.y} ${r.width}x${r.height}`);
    return [v.id, r.x, r.y, r.width, r.height];
});

const transformRect = (rect, matrix) => {
    const { left, top, right, bottom } = rect;
    const { a, b, c, d, e: tx, f: ty } = matrix;
    const dx = (left + right) / 2,
        dy = (top + bottom) / 2;
    const newCorners = [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
    ].map(([x, y]) => [a * (x - dx) + c * (y - dy) + tx + dx, b * (x - dx) + d * (y - dy) + ty + dy]);
    const _left = Math.min(...newCorners.map((p) => p[0]));
    const _right = Math.max(...newCorners.map((p) => p[0]));
    const _top = Math.min(...newCorners.map((p) => p[1]));
    const _bottom = Math.max(...newCorners.map((p) => p[1]));

    return DOMRect.fromRect({ x: _left, y: _top, width: _right - _left, height: _bottom - _top }); // or just
    // return {x: _left, y: _top, width: _right - _left, height: _bottom - _top}
};
const graphics = Array.from(root.querySelectorAll(`*`)).filter((v) => v instanceof SVGGraphicsElement);

window.boxes = Array.from(root.querySelectorAll(`*[id]`)).map((v) => {
    const r = v.getBoundingClientRect();
    v.setAttribute('bcr', `${r.x},${r.y} ${r.width}x${r.height}`);
    return [v.id, r.x, r.y, r.width, r.height];
});

window.bboxes = Array.from(root.querySelectorAll(`*[id]`))
    .filter((v) => !!v.getBBox)
    .map((v) => {
        const r = v.getBBox();
        v.setAttribute('bb', `${r.x},${r.y} ${r.width}x${r.height}`);

        return [v.id, r.x, r.y, r.width, r.height];
    });

window.root_tms = Array.from(root.querySelectorAll(`*[id]`))
    .filter((v) => !!v.getTransformToElement)
    .map((v) => {
        const { a, b, c, d, e, f } = v.getTransformToElement(root);
        return [v.id, a, b, c, d, e, f];
    });

root.querySelectorAll(`*[id]`).forEach((v) => {
    window[v.id] = v;
});

window[root.id] = root;

function generateSelector(context) {
    let index, pathSelector, localName;

    if (context == 'null') throw 'not an dom reference';
    // call getIndex function
    index = getIndex(context);

    while (context.tagName) {
        // selector path
        pathSelector = context.localName + (pathSelector ? '>' + pathSelector : '');
        context = context.parentNode;
    }
    // selector path for nth of type
    pathSelector = pathSelector + `:nth-of-type(${index})`;
    return pathSelector;
}

// get index for nth of type element
function getIndex(node) {
    let i = 1;
    let tagName = node.tagName;

    while (node.previousSibling) {
        node = node.previousSibling;
        if (node.nodeType === 1 && tagName.toLowerCase() == node.tagName.toLowerCase()) {
            i++;
        }
    }
    return i;
}

const letId = (() => {
    let _id_map = {};
    function nextUniqueId(name) {
        if (_id_map[name]) {
            ++_id_map[name];
        } else {
            _id_map[name] = 1;
        }
        return `${name}_${_id_map[name]}`;
    }

    return (node) => {
        let id = node.getAttribute('id');
        if (!id) {
            id = nextUniqueId(node.localName);
            node.setAttribute('id', id);
        }
        return id;
    };
})();

function trBox(r, m) {
    const a = DOMPoint.fromPoint({
        x: r.x,
        y: r.y,
    }).matrixTransform(m);
    const b = DOMPoint.fromPoint({
        x: r.x + r.width,
        y: r.y + r.height,
    }).matrixTransform(m);
    return DOMRect.fromRect({ x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y });
}
function transformBox(r, m) {
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let maxY = -Infinity;
    const { x, y, bottom, right } = r;
    [
        [x, y],
        [right, y],
        [x, bottom],
        [right, bottom],
    ].forEach(function ([px, py]) {
        const { x, y } = DOMPoint.fromPoint({ x: px, y: py }).matrixTransform(m);

        xMin = Math.min(xMin, x);
        xMax = Math.max(xMax, x);
        yMin = Math.min(yMin, y);
        maxY = Math.max(maxY, y);
    });
    return DOMRect.fromRect({ x: xMin, y: yMin, width: Math.abs(xMax - xMin), height: Math.abs(maxY - yMin) });
}

{
    let metrix = (window.metrix = {});
    graphics.forEach((v) => {
        const root_tm = v.getTransformToElement(root);
        const { a, b, c, d, e, f } = root_tm;
        v.style.strokeWidth = 0;
        const r = v.getBoundingClientRect();
        const rb = v.getBBox();
        const root_box = transformBox(r, root.getScreenCTM().inverse());
  

        // v.setAttribute('bb', `${r.x},${r.y} ${r.width}x${r.height}`);
        metrix[letId(v)] = {
            root_tm: [a, b, c, d, e, f],
            tag_name: v.localName,
            rect: [r.x, r.y, r.width, r.height],
            box: [rb.x, rb.y, rb.width, rb.height],
            root_box: [root_box.x, root_box.y, root_box.width, root_box.height],
        };

        v.setAttribute('bcr', `${r.x},${r.y} ${r.width}x${r.height}`);
        v.setAttribute('root_tm', `${a} ${b} ${c} ${d} ${e} ${f}`);
        v.setAttribute('bbox', `${rb.x},${rb.y} ${rb.width}x${rb.height}`);
        v.setAttribute('rb', `${root_box.x},${root_box.y} ${root_box.width}x${root_box.height}`);
    });
    metrix['-'] = root.outerHTML;
}

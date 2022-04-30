((a) => {
    window.geom_lines = a;
})(
    Array.from(document.documentElement.querySelectorAll(`line[id]`)).map((v) => {
        const [x1, y1, x2, y2] = [v.x1.baseVal.value, v.y1.baseVal.value, v.x2.baseVal.value, v.y2.baseVal.value];
        v.setAttribute('geom', `${x1},${y1} ${x2},${y2}`);
        return [v.id, x1, y1, x2, y2];
    })
);

window.geom_rects = Array.from(document.documentElement.querySelectorAll(`rect[id], svg[id]`))
    .concat(document.documentElement)
    .map((v) => {
        const a = [v.x.baseVal.value, v.y.baseVal.value, v.width.baseVal.value, v.height.baseVal.value];
        v.setAttribute('geom', `${a[0]},${a[1]} ${a[2]}x${a[3]}`);
        return [v.id, ...a];
    });

window.geom_marus = Array.from(document.documentElement.querySelectorAll(`circle`))
    .map((v) => {
        const r = v.getBoundingClientRect();
        const a = [v.r.baseVal.value, v.cx.baseVal.value, v.cy.baseVal.value];
        v.setAttribute('geom', `${a[0]} @ ${a[1]},${a[2]}`);
        return [v.id, ...a];
    })
    .filter((v) => v[0]);
window.boxes = Array.from(document.documentElement.querySelectorAll(`*[id]`)).map((v) => {
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

window.boxes = Array.from(document.documentElement.querySelectorAll(`*[id]`)).map((v) => {
    const r = v.getBoundingClientRect();
    v.setAttribute('bcr', `${r.x},${r.y} ${r.width}x${r.height}`);
    return [v.id, r.x, r.y, r.width, r.height];
});

window.bboxes = Array.from(document.documentElement.querySelectorAll(`*[id]`)).map((v) => {
    const r = v.getBBox();
    v.setAttribute('bb', `${r.x},${r.y} ${r.width}x${r.height}`);

    return [v.id, r.x, r.y, r.width, r.height];
});

document.documentElement.querySelectorAll(`*[id]`).forEach((v) => {
    window[v.id] = v;
});

window[document.documentElement.id] = document.documentElement;

const root = document.documentElement;
root.id || (root.id = "V0");
SVGElement.prototype.getTransformToElement =
  SVGElement.prototype.getTransformToElement ||
  function (toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
  };

let nmap = {};

function nameno(name) {
  return `_${name}_${(nmap[name] = (nmap[name] ?? 0) + 1)
    .toString(36)
    .toUpperCase()}`;
}

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
  ].map(([x, y]) => [
    a * (x - dx) + c * (y - dy) + tx + dx,
    b * (x - dx) + d * (y - dy) + ty + dy,
  ]);
  const _left = Math.min(...newCorners.map((p) => p[0]));
  const _right = Math.max(...newCorners.map((p) => p[0]));
  const _top = Math.min(...newCorners.map((p) => p[1]));
  const _bottom = Math.max(...newCorners.map((p) => p[1]));

  return DOMRect.fromRect({
    x: _left,
    y: _top,
    width: _right - _left,
    height: _bottom - _top,
  }); // or just
  // return {x: _left, y: _top, width: _right - _left, height: _bottom - _top}
};

{
  const ids = new Set();
  Array.from(root.getElementsByTagName("*")).forEach((e) => {
    if (e.id) {
      if (ids.has(e.id)) {
        console.warn(`Duplicate id '${e.id}'`);
        e.id = "";
      } else {
        ids.add(e.id);
      }
    }
    if (e instanceof SVGTextElement) {
      const b = e.getBBox();
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.x.baseVal.value = b.x;
      r.y.baseVal.value = b.y;
      r.width.baseVal.value = b.width;
      r.height.baseVal.value = b.height;
      r.setAttribute("style", "fill:pink;fill-opacity:.3");
      e.after(r);
    } else if (e instanceof SVGSVGElement) {
      const b = e.getBBox();
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.x.baseVal.value = b.x;
      r.y.baseVal.value = b.y;
      r.width.baseVal.value = b.width;
      r.height.baseVal.value = b.height;
      r.setAttribute("style", "fill:orange;fill-opacity:.3");
      e.after(r);
    }
  });
}

const elements = Array.from(root.getElementsByTagName("*"));

const graphics = elements
  .filter((v) => v instanceof SVGGraphicsElement)
  // .filter(
  //   (v) => v instanceof SVGGraphicsElement || v instanceof SVGSymbolElement
  // )
  .filter((v) => !(v instanceof SVGTextElement));

graphics.forEach((e) => {
  if (!e.id) {
    e.id = nameno(e.localName);
  }
});

const groups = graphics.filter((v) => v instanceof SVGGElement);

window.svg_groups = groups;
window.svg_graphics = graphics;
window.svg_elements = elements;

root.querySelectorAll(`*[id]`).forEach((v) => {
  window[v.id] = v;
});

window[root.id] = root;

function generateSelector(context) {
  let index, pathSelector, localName;

  if (context == "null") throw "not an dom reference";
  // call getIndex function
  index = getIndex(context);

  while (context.tagName) {
    // selector path
    pathSelector = context.localName + (pathSelector ? ">" + pathSelector : "");
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
    if (
      node.nodeType === 1 &&
      tagName.toLowerCase() == node.tagName.toLowerCase()
    ) {
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
    let id = node.getAttribute("id");
    if (!id) {
      id = nextUniqueId(node.localName);
      node.setAttribute("id", id);
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
  return DOMRect.fromRect({
    x: a.x,
    y: a.y,
    width: b.x - a.x,
    height: b.y - a.y,
  });
}
function transformBox(r, m) {
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let max_y = -Infinity;
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
    max_y = Math.max(max_y, y);
  });
  return DOMRect.fromRect({
    x: xMin,
    y: yMin,
    width: Math.abs(xMax - xMin),
    height: Math.abs(max_y - yMin),
  });
}
function boxArray(r) {
  return [r.x, r.y, r.width, r.height];
}
function matArray(r) {
  const { a, b, c, d, e, f } = r;
  return [a, b, c, d, e, f];
}

{
  const ids = new Set();
  let metrix = (window.metrix = {});
  graphics.forEach((v) => {
    v.style.strokeWidth = 0;
  });
  graphics.forEach((v) => {
    const root_tm = (() => {
      try {
        return v.getTransformToElement(root);
      } catch (err) {
        return {};
      }
    })();
    const inner_tm = (() => {
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      v.appendChild(r);
      try {
        return r.getTransformToElement(root);
      } catch (err) {
        return {};
      } finally {
        r.remove();
      }
    })();
    // a, clipPath, defs, g, marker, mask, pattern, svg, switch, symbol
    const { a, b, c, d, e, f } = root_tm;
    const r = v.getBoundingClientRect();
    const rb = v.getBBox();
    const root_box = transformBox(r, root.getScreenCTM().inverse());
    if (v.id) {
      if (ids.has(v.id)) {
        throw Error(`duplicate ${v.id}`);
      }
      ids.add(v.id);
    } else {
      throw Error(`no id`);
    }

    // v.setAttribute('bb', `${r.x},${r.y} ${r.width}x${r.height}`);
    metrix[v.id] = {
      root_tm: [a, b, c, d, e, f],
      inner_tm: matArray(inner_tm),
      ctm: matArray(v.getCTM()),
      sctm: matArray(v.getScreenCTM()),
      tag_name: v.localName,
      rect: boxArray(r),
      box: boxArray(rb),
      root_box: [root_box.x, root_box.y, root_box.width, root_box.height],
      box_from: Object.fromEntries(
        groups.map((v) => [
          v.id,
          boxArray(transformBox(r, v.getScreenCTM().inverse())),
        ])
      ),
    };

    v.setAttribute("bcr", `${r.x},${r.y} ${r.width}x${r.height}`);
    v.setAttribute("root_tm", `${a} ${b} ${c} ${d} ${e} ${f}`);
    rb && v.setAttribute("bbox", `${rb.x},${rb.y} ${rb.width}x${rb.height}`);
    v.setAttribute(
      "rb",
      `${root_box.x},${root_box.y} ${root_box.width}x${root_box.height}`
    );
  });
  metrix[""] = root.outerHTML;
  graphics.forEach((v) => {
    v.style.strokeWidth = null;
  });
}

function getScreenCTM(n) {
  if (n instanceof SVGSVGElement) {
    n.insertAdjacentHTML("afterbegin", '<g data-dummy="1"/>');
    const d = n.querySelector("g[data-dummy]");
    const m = d.getScreenCTM();
    d.remove();
    return m;
  }
  return n.getScreenCTM();
}

window.trsubs = [...graphics, root]
  .filter((root) => ["g", "svg"].indexOf(root.localName) > -1)
  .map((root) => {
    const trs = Array.from(root.querySelectorAll(`*`))
      .filter((sub) => sub instanceof SVGGraphicsElement)
      .map((sub) => {
        const m = getScreenCTM(root).inverse().multiply(sub.getScreenCTM());
        const { a, b, c, d, e, f } = m;
        return [sub.id, a, b, c, d, e, f];
      });
    return [root.id, ...trs];
  });

/*
root_boxes = Object.entries(metrix).map(([k,v], i)=>[k, ...(v.root_box ?? [])])
*/

import { NEXT, END } from "./node.js";
import { ParentNode } from "./parent-node.js";
export class NonElementParentNode extends ParentNode {
    getElementById(id) {
        id || (id = "" + id);
        let { [END]: end } = this;
        let cur = this;
        while ((cur = cur[NEXT]) && cur !== end) {
            if (cur.nodeType === 1) {
                if (cur.getAttribute("id") === id) {
                    if (id.length > 0) {
                        return cur;
                    }
                    break;
                }
            }
        }
        return null;
    }
}
//# sourceMappingURL=non-element-parent-node.js.map
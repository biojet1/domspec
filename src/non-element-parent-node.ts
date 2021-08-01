import { PREV, NEXT, END } from "./node.js";
import { ParentNode } from "./parent-node.js";

export abstract class NonElementParentNode extends ParentNode {
	getElementById(id: string) {
		let { [NEXT]: next, [END]: end } = this;
		for (; next && next !== end; next = next.endNode[NEXT]) {
			if (next.nodeType === 1) {
				const el = next as Element;
				if (el.id === id) {
					return next;
				}
			}
		}
		return null;
	}

	// cloneNode(deep) {
	//   const {ownerDocument, constructor} = this;
	//   const nonEPN = new constructor(ownerDocument);
	//   if (deep) {
	//     const {[END]: end} = nonEPN;
	//     for (const node of this.childNodes)
	//       nonEPN.insertBefore(node.cloneNode(deep), end);
	//   }
	//   return nonEPN;
	// }

	// toString() {
	//   const {childNodes, localName} = this;
	//   return `<${localName}>${childNodes.join('')}</${localName}>`;
	// }

	// toJSON() {
	//   const json = [];
	//   nonElementAsJSON(this, json);
	//   return json;
	// }
}

// import { ChildNode } from "./child-node.js";
import { Element } from "./element.js";

import { NonElementParentNode } from "./non-element-parent-node.js";

export class DocumentFragment extends NonElementParentNode {
	// https://dom.spec.whatwg.org/#documentfragment
	get nodeType() {
		return 11;
	}
	get nodeName() {
		return "#document-fragment";
	}
}

import { NonElementParentNode } from "./non-element-parent-node.js";

export class DocumentType extends NonElementParentNode {
	readonly publicId: string;
	readonly systemId: string;
	readonly name: string;
	constructor(name: string, publicId: string = "", systemId: string = "") {
		super();
		this.name = name;
		this.publicId = publicId || "";
		this.systemId = systemId || "";
	}
	get nodeType() {
		return 10;
	}
	get nodeName() {
		return this.name;
	}
	get nodeLength() {
		return 0;
	}
}

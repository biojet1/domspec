import { ChildNode } from "./child-node.js";
export class DocumentType extends ChildNode {
	publicId: string;
	systemId: string;
	name: string;
	constructor(name: string, publicId: string = "", systemId: string = "") {
		super();
		this.name = name;
		this.publicId = publicId;
		this.systemId = systemId;
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
	cloneNode(deep?: boolean) {
		const { name, publicId, systemId } = this;
		return new DocumentType(name, publicId, systemId);
	}
	formatXML() {
		const { name, publicId, systemId } = this;
		return `<!DOCTYPE ${name}${
			publicId !== "" ? ` PUBLIC ${publicId}` : ""
		}${systemId !== "" ? ` "${systemId}"` : ""}>`;
	}
}

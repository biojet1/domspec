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
	// get nodeLength() {
	// 	return 0;
	// }
	cloneNode(deep?: boolean) {
		const { name, publicId, systemId } = this;
		return new DocumentType(name, publicId, systemId);
	}
	toString() {
		const { name, publicId, systemId } = this;
		return `<!DOCTYPE ${name}${
			publicId !== "" ? ` PUBLIC ${publicId}` : ""
		}${systemId !== "" ? ` "${systemId}"` : ""}>`;
	}
	isEqualNode(node: Node) {
		if (this === node) {
			return true;
		} else if (!node || this.nodeType !== node.nodeType) {
			return false;
		}
		const { name: nameA, publicId: publicIdA, systemId: systemIdA } = this;
		const {
			name: nameB,
			publicId: publicIdB,
			systemId: systemIdB,
		} = node as DocumentType;
		return (
			((!nameA && !nameB) || nameA === nameB) &&
			((!publicIdA && !publicIdB) || publicIdA === publicIdB) &&
			((!systemIdA && !systemIdB) || systemIdA === systemIdB)
		);
	}
}
import { Node } from "./node.js";
import { ChildNode } from "./child-node.js";

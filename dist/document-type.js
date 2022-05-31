export class DocumentType extends ChildNode {
    publicId;
    systemId;
    name;
    constructor(name, publicId = '', systemId = '') {
        super();
        checkQName(name);
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
    cloneNode(deep) {
        const { name, publicId, systemId } = this;
        return new DocumentType(name, publicId, systemId);
    }
    toString() {
        const { name, publicId, systemId } = this;
        return `<!DOCTYPE ${name}${publicId ? ` PUBLIC "${publicId}"` : ''}${systemId ? (publicId ? ` "${systemId}"` : ` SYSTEM "${systemId}"`) : ''}>`;
    }
    isEqualNode(node) {
        if (this === node) {
            return true;
        }
        else if (!node || this.nodeType !== node.nodeType) {
            return false;
        }
        const { name: nameA, publicId: publicIdA, systemId: systemIdA } = this;
        const { name: nameB, publicId: publicIdB, systemId: systemIdB } = node;
        return (((!nameA && !nameB) || nameA === nameB) &&
            ((!publicIdA && !publicIdB) || publicIdA === publicIdB) &&
            ((!systemIdA && !systemIdB) || systemIdA === systemIdB));
    }
}
import { ChildNode } from './child-node.js';
import { checkQName } from './namespace.js';
//# sourceMappingURL=document-type.js.map
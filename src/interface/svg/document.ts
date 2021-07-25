import { Document } from "../document.js";
import { HTML } from "../namespace.js";

export class SVGDocument extends Document {
	constructor() {
		super('image/svg+xml');
		// this.namespaceURI = HTML;
	}

	// get contentType{
	// 	return;
	// }
}

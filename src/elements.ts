import { Element } from "./element.js";
import { HTMLElement } from "./html/element.js";
import { SVGElement } from "./svg/element.js";
import { XMLNS, XML } from "./namespace.js";

export function newElement(
	contentType: string,
	qualifiedName: string,
	namespace?: string | null
) {
	let prefix, localName, tag;
	const ns = namespace && namespace !== "" ? namespace : undefined;
	const pos = qualifiedName.indexOf(":");

	if (pos >= 0) {
		prefix = qualifiedName.substring(0, pos);
		localName = qualifiedName.substring(pos + 1);
	} else {
		localName = qualifiedName;
	}
	if (
		(prefix && !ns) ||
		(prefix === "xml" && ns !== XML) ||
		((prefix === "xmlns" || qualifiedName === "xmlns") && ns !== XMLNS) ||
		(ns === XMLNS && !(prefix === "xmlns" || qualifiedName === "xmlns"))
	) {
		throw new Error("NamespaceError");
	}

	switch (ns || contentType) {
		case "text/html":
		case "http://www.w3.org/1999/xhtml":
			tag = (prefix ? `${prefix}:${localName}` : localName).toUpperCase();
			switch (localName) {
				// case "div":
				// 	return new HTMLDivElement(localName, ns, prefix, tag);
				default:
					return new HTMLElement(localName, ns, prefix, tag);
			}
		case "image/svg+xml":
		case "http://www.w3.org/2000/svg":
			switch (localName) {
				// case "svg":
				// 	return new SVGSvgElement(localName, ns, prefix, tag);
				default:
					return new SVGElement(localName, ns, prefix, tag);
			}
		default:
			return new Element(localName, ns, prefix, tag);
	}
}

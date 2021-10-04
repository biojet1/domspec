export const XMLNS = "http://www.w3.org/2000/xmlns/";
export const HTML_NS = "http://www.w3.org/1999/xhtml";
export const XML_NS = "http://www.w3.org/XML/1998/namespace";
export const MATHML_NS = "http://www.w3.org/1998/Math/MathML";
export const SVG_NS = "http://www.w3.org/2000/svg";
export const XLINK_NS = "http://www.w3.org/1999/xlink";

export const NCNameRE = /^[_A-Za-z][\w_-]*$/;
export const NameRE = /^[:A-Z_a-z][:A-Z_a-z0-9.-]*$/;

export function checkName(name: string) {
	if (!NameRE.test(name)) {
		throw DOMException.new("InvalidCharacterErr", `Name '${name}'`);
	}
}

export function validateAndExtract(
	ns: string | null,
	qualifiedName: string
): [string | null, string | null, string] {
	if (ns) {
		let prefix,
			localName,
			pos = qualifiedName.indexOf(":");

		if (pos >= 0) {
			prefix = qualifiedName.substring(0, pos);
			localName = qualifiedName.substring(pos + 1);
			if (!/^[_A-Za-z]\w*:[_A-Za-z][\w_-]*$/.test(qualifiedName)) {
				throw DOMException.new(
					"InvalidCharacterErr",
					`qualifiedName '${qualifiedName}'`
				);
			}
			// if (prefix && !NCNameRE.test(prefix)) {
			// 	throw DOMException.new(
			// 		"InvalidCharacterErr",
			// 		`prefix '${prefix}'`
			// 	);
			// } else if (!NCNameRE.test(localName)) {
			// 	throw DOMException.new(
			// 		"InvalidCharacterErr",
			// 		`localName '${localName}'`
			// 	);
			// }
		} else {
			prefix = "";
			localName = qualifiedName;
			if (!NCNameRE.test(qualifiedName)) {
				throw DOMException.new(
					"InvalidCharacterErr",
					`qualifiedName '${qualifiedName}'`
				);
			}
		}
		if (
			(prefix && !ns) ||
			(prefix === "xml" && ns !== XML_NS) ||
			((prefix === "xmlns" || qualifiedName === "xmlns") &&
				ns !== XMLNS) ||
			(ns === XMLNS && !(prefix === "xmlns" || qualifiedName === "xmlns"))
		) {
			throw DOMException.new(
				"NamespaceError",
				`NS[${ns}] QN[${qualifiedName}] LN[${localName}] P[${prefix}]`
			);
		}

		return [ns, prefix, localName];
	} else {
		if (qualifiedName.indexOf(":") < 0) {
			if (!NameRE.test(qualifiedName)) {
				throw DOMException.new(
					"InvalidCharacterErr",
					`name '${qualifiedName}'`
				);
			}
			return [null, null, qualifiedName];
		} else {
			throw DOMException.new(
				"NamespaceError",
				`'${ns}' '${qualifiedName}'`
			);
		}
	}
}

import { DOMException } from "./event-target.js";

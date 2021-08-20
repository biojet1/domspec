import { XMLNS, XML } from "./namespace.js";
import { Element } from "./element.js";
import { SVGElement } from "./svg/element.js";
import {
	HTMLAnchorElement,
	HTMLAreaElement,
	HTMLAudioElement,
	HTMLBRElement,
	HTMLBaseElement,
	HTMLBodyElement,
	HTMLButtonElement,
	HTMLCanvasElement,
	HTMLDListElement,
	HTMLDataElement,
	HTMLDataListElement,
	HTMLDetailsElement,
	HTMLDialogElement,
	HTMLDirectoryElement,
	HTMLDivElement,
	HTMLElement,
	HTMLEmbedElement,
	HTMLFieldSetElement,
	HTMLFontElement,
	HTMLFormElement,
	HTMLFrameElement,
	HTMLFrameSetElement,
	HTMLHRElement,
	HTMLHeadElement,
	HTMLHeadingElement,
	HTMLHtmlElement,
	HTMLIFrameElement,
	HTMLImageElement,
	HTMLInputElement,
	HTMLLIElement,
	HTMLLabelElement,
	HTMLLegendElement,
	HTMLLinkElement,
	HTMLMapElement,
	HTMLMarqueeElement,
	HTMLMediaElement,
	HTMLMenuElement,
	HTMLMetaElement,
	HTMLMeterElement,
	HTMLModElement,
	HTMLOListElement,
	HTMLObjectElement,
	HTMLOptGroupElement,
	HTMLOptionElement,
	HTMLOutputElement,
	HTMLParagraphElement,
	HTMLParamElement,
	HTMLPictureElement,
	HTMLPreElement,
	HTMLProgressElement,
	HTMLQuoteElement,
	HTMLScriptElement,
	HTMLSelectElement,
	HTMLSlotElement,
	HTMLSourceElement,
	HTMLSpanElement,
	HTMLStyleElement,
	HTMLTableCaptionElement,
	HTMLTableCellElement,
	HTMLTableColElement,
	HTMLTableElement,
	HTMLTableRowElement,
	HTMLTableSectionElement,
	HTMLTemplateElement,
	HTMLTextAreaElement,
	HTMLTimeElement,
	HTMLTitleElement,
	HTMLTrackElement,
	HTMLUListElement,
	HTMLUnknownElement,
	HTMLVideoElement,
} from "./html/element.js";


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
				case "abbr":
				case "address":
				case "article":
				case "aside":
				case "b":
				case "bdi":
				case "bdo":
				case "cite":
				case "code":
				case "dd":
				case "dfn":
				case "dt":
				case "em":
				case "figcaption":
				case "figure":
				case "footer":
				case "header":
				case "hgroup":
				case "i":
				case "kbd":
				case "main":
				case "mark":
				case "nav":
				case "noscript":
				case "rp":
				case "rt":
				case "ruby":
				case "s":
				case "samp":
				case "section":
				case "small":
				case "strong":
				case "sub":
				case "summary":
				case "sup":
				case "u":
				case "var":
				case "wbr":
					return new HTMLElement(localName, ns, prefix, tag);
				case "a":
					return new HTMLAnchorElement(localName, ns, prefix, tag);
				case "area":
					return new HTMLAreaElement(localName, ns, prefix, tag);
				case "audio":
					return new HTMLAudioElement(localName, ns, prefix, tag);
				case "base":
					return new HTMLBaseElement(localName, ns, prefix, tag);
				case "body":
					return new HTMLBodyElement(localName, ns, prefix, tag);
				case "br":
					return new HTMLBRElement(localName, ns, prefix, tag);
				case "button":
					return new HTMLButtonElement(localName, ns, prefix, tag);
				case "canvas":
					return new HTMLCanvasElement(localName, ns, prefix, tag);
				case "data":
					return new HTMLDataElement(localName, ns, prefix, tag);
				case "datalist":
					return new HTMLDataListElement(localName, ns, prefix, tag);
				case "details":
					return new HTMLDetailsElement(localName, ns, prefix, tag);
				case "dialog":
					return new HTMLDialogElement(localName, ns, prefix, tag);
				case "dir":
					return new HTMLDirectoryElement(localName, ns, prefix, tag);
				case "div":
					return new HTMLDivElement(localName, ns, prefix, tag);
				case "dl":
					return new HTMLDListElement(localName, ns, prefix, tag);
				case "embed":
					return new HTMLEmbedElement(localName, ns, prefix, tag);
				case "fieldset":
					return new HTMLFieldSetElement(localName, ns, prefix, tag);
				case "font":
					return new HTMLFontElement(localName, ns, prefix, tag);
				case "form":
					return new HTMLFormElement(localName, ns, prefix, tag);
				case "frame":
					return new HTMLFrameElement(localName, ns, prefix, tag);
				case "frameset":
					return new HTMLFrameSetElement(localName, ns, prefix, tag);
				case "h1":
				case "h2":
				case "h3":
				case "h4":
				case "h5":
				case "h6":
					return new HTMLHeadingElement(localName, ns, prefix, tag);
				case "head":
					return new HTMLHeadElement(localName, ns, prefix, tag);
				case "hr":
					return new HTMLHRElement(localName, ns, prefix, tag);
				case "html":
					return new HTMLHtmlElement(localName, ns, prefix, tag);
				case "iframe":
					return new HTMLIFrameElement(localName, ns, prefix, tag);
				case "img":
					return new HTMLImageElement(localName, ns, prefix, tag);
				case "input":
					return new HTMLInputElement(localName, ns, prefix, tag);
				case "label":
					return new HTMLLabelElement(localName, ns, prefix, tag);
				case "legend":
					return new HTMLLegendElement(localName, ns, prefix, tag);
				case "li":
					return new HTMLLIElement(localName, ns, prefix, tag);
				case "link":
					return new HTMLLinkElement(localName, ns, prefix, tag);
				case "map":
					return new HTMLMapElement(localName, ns, prefix, tag);
				case "marquee":
					return new HTMLMarqueeElement(localName, ns, prefix, tag);
				case "menu":
					return new HTMLMenuElement(localName, ns, prefix, tag);
				case "meta":
					return new HTMLMetaElement(localName, ns, prefix, tag);
				case "meter":
					return new HTMLMeterElement(localName, ns, prefix, tag);
				case "del":
				case "ins":
					return new HTMLModElement(localName, ns, prefix, tag);
				case "object":
					return new HTMLObjectElement(localName, ns, prefix, tag);
				case "ol":
					return new HTMLOListElement(localName, ns, prefix, tag);
				case "optgroup":
					return new HTMLOptGroupElement(localName, ns, prefix, tag);
				case "option":
					return new HTMLOptionElement(localName, ns, prefix, tag);
				case "output":
					return new HTMLOutputElement(localName, ns, prefix, tag);
				case "p":
					return new HTMLParagraphElement(localName, ns, prefix, tag);
				case "param":
					return new HTMLParamElement(localName, ns, prefix, tag);
				case "picture":
					return new HTMLPictureElement(localName, ns, prefix, tag);
				case "listing":
				case "pre":
				case "xmp":
					return new HTMLPreElement(localName, ns, prefix, tag);
				case "progress":
					return new HTMLProgressElement(localName, ns, prefix, tag);
				case "blockquote":
				case "q":
					return new HTMLQuoteElement(localName, ns, prefix, tag);
				case "script":
					return new HTMLScriptElement(localName, ns, prefix, tag);
				case "select":
					return new HTMLSelectElement(localName, ns, prefix, tag);
				case "slot":
					return new HTMLSlotElement(localName, ns, prefix, tag);
				case "source":
					return new HTMLSourceElement(localName, ns, prefix, tag);
				case "span":
					return new HTMLSpanElement(localName, ns, prefix, tag);
				case "style":
					return new HTMLStyleElement(localName, ns, prefix, tag);
				case "caption":
					return new HTMLTableCaptionElement(
						localName,
						ns,
						prefix,
						tag
					);
				case "th":
				case "td":
					return new HTMLTableCellElement(localName, ns, prefix, tag);
				case "col":
				case "colgroup":
					return new HTMLTableColElement(localName, ns, prefix, tag);
				case "table":
					return new HTMLTableElement(localName, ns, prefix, tag);
				case "time":
					return new HTMLTimeElement(localName, ns, prefix, tag);
				case "title":
					return new HTMLTitleElement(localName, ns, prefix, tag);
				case "tr":
					return new HTMLTableRowElement(localName, ns, prefix, tag);
				case "thead":
				case "tbody":
				case "tfoot":
					return new HTMLTableSectionElement(
						localName,
						ns,
						prefix,
						tag
					);
				case "template":
					return new HTMLTemplateElement(localName, ns, prefix, tag);
				case "textarea":
					return new HTMLTextAreaElement(localName, ns, prefix, tag);
				case "track":
					return new HTMLTrackElement(localName, ns, prefix, tag);
				case "ul":
					return new HTMLUListElement(localName, ns, prefix, tag);
				case "video":
					return new HTMLVideoElement(localName, ns, prefix, tag);
			}
			return new HTMLUnknownElement(localName, ns, prefix, tag);

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

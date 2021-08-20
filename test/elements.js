const HTML_NS = "http://www.w3.org/1999/xhtml";
const SVG_NS = "http://www.w3.org/2000/svg";

const INTERFACE_TAG_MAPPING = {
	// https://html.spec.whatwg.org/multipage/dom.html#elements-in-the-dom%3Aelement-interface
	// https://html.spec.whatwg.org/multipage/indices.html#elements-3
	[HTML_NS]: {
		HTMLElement: [
			"abbr",
			"address",
			"article",
			"aside",
			"b",
			"bdi",
			"bdo",
			"cite",
			"code",
			"dd",
			"dfn",
			"dt",
			"em",
			"figcaption",
			"figure",
			"footer",
			"header",
			"hgroup",
			"i",
			"kbd",
			"main",
			"mark",
			"nav",
			"noscript",
			"rp",
			"rt",
			"ruby",
			"s",
			"samp",
			"section",
			"small",
			"strong",
			"sub",
			"summary",
			"sup",
			"u",
			"var",
			"wbr",
		],
		HTMLAnchorElement: ["a"],
		HTMLAreaElement: ["area"],
		HTMLAudioElement: ["audio"],
		HTMLBaseElement: ["base"],
		HTMLBodyElement: ["body"],
		HTMLBRElement: ["br"],
		HTMLButtonElement: ["button"],
		HTMLCanvasElement: ["canvas"],
		HTMLDataElement: ["data"],
		HTMLDataListElement: ["datalist"],
		HTMLDetailsElement: ["details"],
		HTMLDialogElement: ["dialog"],
		HTMLDirectoryElement: ["dir"],
		HTMLDivElement: ["div"],
		HTMLDListElement: ["dl"],
		HTMLEmbedElement: ["embed"],
		HTMLFieldSetElement: ["fieldset"],
		HTMLFontElement: ["font"],
		HTMLFormElement: ["form"],
		HTMLFrameElement: ["frame"],
		HTMLFrameSetElement: ["frameset"],
		HTMLHeadingElement: ["h1", "h2", "h3", "h4", "h5", "h6"],
		HTMLHeadElement: ["head"],
		HTMLHRElement: ["hr"],
		HTMLHtmlElement: ["html"],
		HTMLIFrameElement: ["iframe"],
		HTMLImageElement: ["img"],
		HTMLInputElement: ["input"],
		HTMLLabelElement: ["label"],
		HTMLLegendElement: ["legend"],
		HTMLLIElement: ["li"],
		HTMLLinkElement: ["link"],
		HTMLMapElement: ["map"],
		HTMLMarqueeElement: ["marquee"],
		HTMLMediaElement: [],
		HTMLMenuElement: ["menu"],
		HTMLMetaElement: ["meta"],
		HTMLMeterElement: ["meter"],
		HTMLModElement: ["del", "ins"],
		HTMLObjectElement: ["object"],
		HTMLOListElement: ["ol"],
		HTMLOptGroupElement: ["optgroup"],
		HTMLOptionElement: ["option"],
		HTMLOutputElement: ["output"],
		HTMLParagraphElement: ["p"],
		HTMLParamElement: ["param"],
		HTMLPictureElement: ["picture"],
		HTMLPreElement: ["listing", "pre", "xmp"],
		HTMLProgressElement: ["progress"],
		HTMLQuoteElement: ["blockquote", "q"],
		HTMLScriptElement: ["script"],
		HTMLSelectElement: ["select"],
		HTMLSlotElement: ["slot"],
		HTMLSourceElement: ["source"],
		HTMLSpanElement: ["span"],
		HTMLStyleElement: ["style"],
		HTMLTableCaptionElement: ["caption"],
		HTMLTableCellElement: ["th", "td"],
		HTMLTableColElement: ["col", "colgroup"],
		HTMLTableElement: ["table"],
		HTMLTimeElement: ["time"],
		HTMLTitleElement: ["title"],
		HTMLTableRowElement: ["tr"],
		HTMLTableSectionElement: ["thead", "tbody", "tfoot"],
		HTMLTemplateElement: ["template"],
		HTMLTextAreaElement: ["textarea"],
		HTMLTrackElement: ["track"],
		HTMLUListElement: ["ul"],
		HTMLUnknownElement: [],
		HTMLVideoElement: ["video"],
	},
	[SVG_NS]: {
		SVGElement: [],
		SVGGraphicsElement: [],
		SVGSVGElement: ["svg"],
		SVGTitleElement: ["title"],
	},
};

switch (process.env.SWITCH) {
	case "html":
		console.log(
			Object.entries(INTERFACE_TAG_MAPPING[HTML_NS])
				.filter(([k, v]) => v.length > 0)
				.map(
					([k, v]) =>
						(v.length > 0
							? v.map((x) => `\t\t\t\tcase "${x}":\n`).join("")
							: `\t\t\t\tdefault:\n`) +
						`\t\t\t\t\treturn new ${k}(localName, ns, prefix, tag);\n`
				)
				.join("")
		);
		break;
}
switch (process.env.CLASS) {
	case "html":
		const excl = /Div|Template|HTMLElement/;
		console.log(
			Object.entries(INTERFACE_TAG_MAPPING[HTML_NS])
				.map(([k, v]) => k)
				.filter((k) => !excl.test(k))
				.sort()
				.map((x) => `export class ${x} extends HTMLElement {}`)
				.join("\n")
		);
		break;
}
switch (process.env.IMPORT) {
	case "html":
		console.log(
			Object.entries(INTERFACE_TAG_MAPPING[HTML_NS])
				.map(([k, v]) => k)
				.sort()
				.map((x) => `\t${x},`)
				.join("\n")
		);
		break;
}

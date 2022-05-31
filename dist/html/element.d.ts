export declare class HTMLElement extends Element {
    hasAttribute(qName: string): boolean;
}
export declare class HTMLScriptElement extends HTMLElement {
    _alreadyStarted?: boolean;
}
export declare class HTMLDivElement extends HTMLElement {
}
export declare class HTMLTemplateElement extends HTMLElement {
    get content(): import("../document-fragment.js").TemplateFragment;
}
export declare class HTMLAnchorElement extends HTMLElement {
    get href(): string;
    set href(value: string);
}
export declare class HTMLStyleElement extends HTMLElement {
    get media(): string | null;
    get sheet(): import("../all.js").CSSStyleSheet;
}
import { Element } from '../element.js';
export declare class HTMLAreaElement extends HTMLElement {
}
export declare class HTMLAudioElement extends HTMLElement {
}
export declare class HTMLBRElement extends HTMLElement {
}
export declare class HTMLBaseElement extends HTMLElement {
}
export declare class HTMLBodyElement extends HTMLElement {
}
export declare class HTMLButtonElement extends HTMLElement {
}
export declare class HTMLCanvasElement extends HTMLElement {
}
export declare class HTMLDListElement extends HTMLElement {
}
export declare class HTMLDataElement extends HTMLElement {
}
export declare class HTMLDataListElement extends HTMLElement {
}
export declare class HTMLDetailsElement extends HTMLElement {
}
export declare class HTMLDialogElement extends HTMLElement {
}
export declare class HTMLDirectoryElement extends HTMLElement {
}
export declare class HTMLEmbedElement extends HTMLElement {
}
export declare class HTMLFieldSetElement extends HTMLElement {
}
export declare class HTMLFontElement extends HTMLElement {
}
export declare class HTMLFormElement extends HTMLElement {
}
export declare class HTMLFrameElement extends HTMLElement {
}
export declare class HTMLFrameSetElement extends HTMLElement {
}
export declare class HTMLHRElement extends HTMLElement {
}
export declare class HTMLHeadElement extends HTMLElement {
}
export declare class HTMLHeadingElement extends HTMLElement {
}
export declare class HTMLHtmlElement extends HTMLElement {
}
export declare class HTMLIFrameElement extends HTMLElement {
}
export declare class HTMLImageElement extends HTMLElement {
}
export declare class HTMLInputElement extends HTMLElement {
}
export declare class HTMLLIElement extends HTMLElement {
}
export declare class HTMLLabelElement extends HTMLElement {
}
export declare class HTMLLegendElement extends HTMLElement {
}
export declare class HTMLLinkElement extends HTMLElement {
}
export declare class HTMLMapElement extends HTMLElement {
}
export declare class HTMLMarqueeElement extends HTMLElement {
}
export declare class HTMLMediaElement extends HTMLElement {
}
export declare class HTMLMenuElement extends HTMLElement {
}
export declare class HTMLMetaElement extends HTMLElement {
}
export declare class HTMLMeterElement extends HTMLElement {
}
export declare class HTMLModElement extends HTMLElement {
}
export declare class HTMLOListElement extends HTMLElement {
}
export declare class HTMLObjectElement extends HTMLElement {
}
export declare class HTMLOptGroupElement extends HTMLElement {
}
export declare class HTMLOptionElement extends HTMLElement {
}
export declare class HTMLOutputElement extends HTMLElement {
}
export declare class HTMLParagraphElement extends HTMLElement {
}
export declare class HTMLParamElement extends HTMLElement {
}
export declare class HTMLPictureElement extends HTMLElement {
}
export declare class HTMLPreElement extends HTMLElement {
}
export declare class HTMLProgressElement extends HTMLElement {
}
export declare class HTMLQuoteElement extends HTMLElement {
}
export declare class HTMLSelectElement extends HTMLElement {
}
export declare class HTMLSlotElement extends HTMLElement {
}
export declare class HTMLSourceElement extends HTMLElement {
}
export declare class HTMLSpanElement extends HTMLElement {
}
export declare class HTMLTableCaptionElement extends HTMLElement {
}
export declare class HTMLTableCellElement extends HTMLElement {
}
export declare class HTMLTableColElement extends HTMLElement {
}
export declare class HTMLTableElement extends HTMLElement {
}
export declare class HTMLTableRowElement extends HTMLElement {
}
export declare class HTMLTableSectionElement extends HTMLElement {
}
export declare class HTMLTextAreaElement extends HTMLElement {
}
export declare class HTMLTimeElement extends HTMLElement {
}
export declare class HTMLTitleElement extends HTMLElement {
}
export declare class HTMLTrackElement extends HTMLElement {
}
export declare class HTMLUListElement extends HTMLElement {
}
export declare class HTMLUnknownElement extends HTMLElement {
}
export declare class HTMLVideoElement extends HTMLElement {
}

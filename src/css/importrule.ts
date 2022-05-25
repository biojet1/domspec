import { CSSRule, MediaList } from './om.js';
import { CSSStyleSheet } from './stylesheet.js';

export class CSSImportRule extends CSSRule {
	href?: string;
	media = new MediaList();
	styleSheet = new CSSStyleSheet();
	get cssText() {
		const {
			href = '',
			media: { mediaText },
		} = this;
		return `@import url(${href})${mediaText ? ' ' + mediaText : ''};`;
	}
	set cssText(value: string) {
		let i = 0;

		/**
		 * @import url(partial.css) screen, handheld;
		 *        ||               |
		 *        after-import     media
		 *         |
		 *         url
		 */
		let state = '';

		let buffer = '';
		let index;
		for (let character; (character = value.charAt(i)); i++) {
			switch (character) {
				case ' ':
				case '\t':
				case '\r':
				case '\n':
				case '\f':
					if (state === 'after-import') {
						state = 'url';
					} else {
						buffer += character;
					}
					break;

				case '@':
					if (!state && value.indexOf('@import', i) === i) {
						state = 'after-import';
						i += 'import'.length;
						buffer = '';
					}
					break;

				case 'u':
					if (state === 'url' && value.indexOf('url(', i) === i) {
						index = value.indexOf(')', i + 1);
						if (index === -1) {
							throw SyntaxError(i + ': ")" not found');
						}
						i += 'url('.length;
						let url = value.slice(i, index);
						if (url[0] === url[url.length - 1]) {
							if (url[0] === '"' || url[0] === "'") {
								url = url.slice(1, -1);
							}
						}
						this.href = url;
						i = index;
						state = 'media';
					}
					break;

				case '"':
					if (state === 'url') {
						index = value.indexOf('"', i + 1);
						if (!index) {
							// index === -1?
							throw SyntaxError(i + ": '\"' not found");
						}
						this.href = value.slice(i + 1, index);
						i = index;
						state = 'media';
					}
					break;

				case "'":
					if (state === 'url') {
						index = value.indexOf("'", i + 1);
						if (!index) {
							// index === -1?
							throw SyntaxError(i + ': "\'" not found');
						}
						this.href = value.slice(i + 1, index);
						i = index;
						state = 'media';
					}
					break;

				case ';':
					if (state === 'media') {
						if (buffer) {
							this.media.mediaText = buffer.trim();
						}
					}
					break;

				default:
					if (state === 'media') {
						buffer += character;
					}
					break;
			}
		}
	}
}

function checkToken(token: string) {
	if (token.length > 0) {
		if (/\s/.test(token)) {
			throw new Error("InvalidCharacterError: white space");
		}
		return token;
	} else {
		throw new Error("SyntaxError: empty token");
	}
}

export class DOMTokenList extends Set<string> {
	add(...tokens: Array<string>): this {
		for (const token of tokens) {
			// console.info("add:", token, this);
			checkToken(token) && super.add(token);
		}
		return this;
	}

	contains(token: string) {
		return this.has(token);
	}

	remove(...tokens: Array<string>) {
		for (const token of tokens) {
			checkToken(token) && this.delete(token);
		}
	}

	toggle(token: string, force?: boolean) {
		if (checkToken(token)) {
			if (this.has(token)) {
				if (force) return true;
				this.delete(token);
			} else if (force || force === undefined) {
				this.add(token);
				return true;
			}
		}
		return false;
	}

	replace(token: string, newToken: string) {
		if (this.has(token)) {
			this.delete(token);
			this.add(newToken);
			return true;
		}
		return false;
	}

	supports(token: string) {
		return true;
	}

	format() {
		return [...this].join(" ");
	}

	parse(tokens: string) {
		this.clear();
		for (const token of tokens.split(/\s+/))
			token.length > 0 && super.add(token);
	}

	get value() {
		return this.format();
	}

	get length() {
		return this.size;
	}

	item(index: number) {
		if (index >= 0) {
			for (const token of this) {
				if (index-- === 0) {
					return token;
				} else if (index < 0) {
					break;
				}
			}
		}
	}

	toString() {
		return this.format();
	}
}
